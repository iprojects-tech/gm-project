from flask import Flask, request, jsonify
import os

from modules.parser import extract_text
from modules.embedder import embed_texts
from modules.vector_store import VectorStore
from modules.retriever import split_text
from llm.ollama_client import ask_llm
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
vs = VectorStore()

def process_all_documents(folder="DATA"):
    if not os.path.exists(folder):
        print("FOLDER NOT FOUND")
        return
    else:
        print("FOLDER FOUND")
        for filename in os.listdir(folder):
            path = os.path.join(folder, filename)
            if os.path.isfile(path):
                text = extract_text(path)
                chunks = split_text(text)
                embeddings = embed_texts(chunks)
                vs.add(embeddings, chunks, source_name=filename)
        print("Documents processed.")

# Procesar documentos al iniciar
process_all_documents()

@app.route("/api/chat", methods=["POST"])
def query_bot():
    data = request.json
    question = data.get("question", "")
    if not question:
        return jsonify({"error": "Missing question"}), 400

    query_embedding = embed_texts([question])[0]
    relevant_data = vs.search(query_embedding, top_k=5)

    context = ""
    sources_display = ""
    for item in relevant_data:
        context += f"[From {item['source']}]: {item['text']}\n"
        sources_display += f"From {item['source']}\n→ {item['text'][:300]}...\n\n"

    answer = ask_llm(context, question)

    return jsonify({
        "answer": answer,
        "sources": sources_display
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
