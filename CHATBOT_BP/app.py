import os, glob, hashlib, threading, requests
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from modules.parser import extract_text_and_images
from modules.embedder import embed_texts, model
from modules.vector_store import VectorStore
from modules.utils import detect_language
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Document Chatbot")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory="storage/images"), name="images")

OLLAMA_API_URL = "http://localhost:11434/api/generate"
DOCS_DIR = ""  # Se define dinámicamente por el usuario

model = SentenceTransformer("paraphrase-MiniLM-L6-v2")
print("Dimensión de embeddings:", model.get_sentence_embedding_dimension())

vs = VectorStore(dim=model.get_sentence_embedding_dimension())

# Cambia aquí: Si hay conocimiento cargado, pon done=True
processing_status = {
    "progress": 0,
    "total": 0,
    "done": vs.has_knowledge(),
    "message": "Ready" if vs.has_knowledge() else "",
}

class AnalyzeRequest(BaseModel):
    path: str

@app.post("/analyze")
def analyze_directory(req: AnalyzeRequest):
    print("Procesando ruta:", req.path)
    global DOCS_DIR, processing_status
    DOCS_DIR = req.path
    files = glob.glob(
        os.path.join(DOCS_DIR, "**", "*.pdf"), recursive=True
    ) + glob.glob(os.path.join(DOCS_DIR, "**", "*.docx"), recursive=True)
    processing_status.update(
        {"progress": 0, "total": len(files), "done": False, "message": "Processing..."}
    )

    def process_files():
        known = set([c.get("hash") for c in vs.data if c.get("hash")])
        print(f"Entró a process_files")
        print(f"Archivos a procesar: {files}")
        for i, f in enumerate(files):
            print(f"Procesando archivo {i+1}/{len(files)}: {f}")
            with open(f, "rb") as fin:
                h = hashlib.md5(fin.read()).hexdigest()
            if h in known:
                processing_status["progress"] = int(100 * (i + 1) / len(files))
                continue
            chunks = extract_text_and_images(f)
            if not chunks:
                print(f"Archivo vacío o sin texto: {f}")
                processing_status["progress"] = int(100 * (i + 1) / len(files))
                continue
            for c in chunks:
                c["hash"] = h
            texts = [c["text"] for c in chunks]
            embeddings = embed_texts(texts)
            print(f"FAISS espera dimensión: {vs.index.d}")
            print(f"Embeddings tienen shape: {getattr(embeddings, 'shape', None)}")
            if hasattr(embeddings, "shape"):
                if embeddings.shape[1] != vs.index.d:
                    print(
                        f"ERROR: El embedding shape {embeddings.shape[1]} no coincide con FAISS ({vs.index.d}) en archivo {f}"
                    )
                    processing_status["progress"] = int(100 * (i + 1) / len(files))
                    continue
                if len(embeddings) != len(chunks):
                    print(
                        f"SKIP: embeddings ({len(embeddings)}) y chunks ({len(chunks)}) no coinciden en {f}"
                    )
                    processing_status["progress"] = int(100 * (i + 1) / len(files))
                    continue
            else:
                print(f"ERROR: embeddings no tiene shape en archivo {f}")
                processing_status["progress"] = int(100 * (i + 1) / len(files))
                continue
            vs.add(embeddings, chunks)
            processing_status["progress"] = int(100 * (i + 1) / len(files))
        processing_status["done"] = True
        processing_status["message"] = "Ready"

    threading.Thread(target=process_files).start()
    return {"message": f"Started processing {len(files)} files."}

@app.get("/progress")
def get_progress():
    # Asegúrate de checar si el vs tiene data después de reiniciar
    if vs.has_knowledge():
        processing_status.update({"done": True, "message": "Ready"})
    return processing_status

class ChatQuery(BaseModel):
    question: str
    lang: Optional[str] = None

def call_ollama_mistral(context: str, question: str, lang: str = "en") -> str:
    prompt = f"""
Contesta en el idioma detectado del usuario.
Contexto extraído de documentos:
{context}

Pregunta del usuario:
{question}

Responde de forma precisa y solo usa la información relevante del contexto. Si no hay información suficiente, di que no la encontraste.
"""
    payload = {
        "model": "mistral",
        "prompt": prompt,
        "stream": False,
        "options": {"temperature": 0.2},
    }
    try:
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=60)
        response.raise_for_status()
        res_json = response.json()
        return res_json.get("response", "").strip()
    except Exception as e:
        return f"Error comunicando con Ollama: {e}"

@app.post("/chat")
def chat(query: ChatQuery):
    if not processing_status.get("done"):
        raise HTTPException(status_code=400, detail="Processing not finished.")
    qlang = query.lang or detect_language(query.question)
    q_emb = embed_texts([query.question])[0]
    results = vs.search(q_emb, top_k=5)
    context, images, sources = "", [], []
    for c in results:
        page = c.get("page")
        src = f"{c['source']} (p. {page})" if page else c["source"]

        if c.get("is_image", False):
            context += f"[Imagen OCR de {src}]: {c['text']}\n"
            images.append(
                {
                    "src": (
                        f"/{c['image_path']}"
                        if not c["image_path"].startswith("/")
                        else c["image_path"]
                    ),
                    "source": c["source"],
                    "page": c.get("page", None),
                }
            )
        else:
            context += f"[De {src}]: {c['text']}\n"
        sources.append(src)
    if not context:
        answer = "No se encontró información relevante en los documentos."
    else:
        answer = call_ollama_mistral(context, query.question, lang=qlang)

    print("DEBUG APP.PY IMGS:", images)

    return {
        "answer": answer,
        "images": images,
        "sources": list(set(sources))
    }

@app.get("/images/{filename}")
def get_image(filename: str):
    img_path = os.path.join("storage", "images", filename)
    if os.path.exists(img_path):
        return FileResponse(img_path)
    return {"error": "not found"}

@app.post("/reset")
def reset_vector_store():
    global vs, processing_status
    vs.reset()
    processing_status = {"progress": 0, "total": 0, "done": False, "message": ""}
    return {"message": "Vector store reset, ready to process new files"}
