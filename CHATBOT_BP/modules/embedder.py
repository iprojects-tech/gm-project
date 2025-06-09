from sentence_transformers import SentenceTransformer

model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

def embed_texts(texts):
    if isinstance(texts[0], dict):
        texts = [c['text'] for c in texts]
    return model.encode(texts, show_progress_bar=False, normalize_embeddings=True)
