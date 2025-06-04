
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_texts(chunks):
    return model.encode(chunks, convert_to_tensor=False)
