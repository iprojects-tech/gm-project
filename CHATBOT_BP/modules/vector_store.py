import faiss
import numpy as np
import os
import pickle

class VectorStore:
    def __init__(self, dim=384, index_path="storage/index.faiss", data_path="storage/data.pkl"):
        self.index_path = index_path
        self.data_path = data_path
        self.dim = dim
        self.data = []

        if os.path.exists(index_path) and os.path.exists(data_path):
            self.index = faiss.read_index(index_path)
            with open(data_path, "rb") as f:
                self.data = pickle.load(f)
        else:
            self.index = faiss.IndexFlatL2(dim)
            self.data = []

    def add(self, embeddings, chunks, source_name):
        self.index.add(np.array(embeddings).astype('float32'))
        self.data.extend([{"text": chunk, "source": source_name} for chunk in chunks])
        self._save()

    def search(self, query_embedding, top_k=5):
        D, I = self.index.search(np.array([query_embedding]).astype('float32'), top_k)
        return [self.data[i] for i in I[0]]

    def _save(self):
        os.makedirs(os.path.dirname(self.index_path), exist_ok=True)
        faiss.write_index(self.index, self.index_path)
        with open(self.data_path, "wb") as f:
            pickle.dump(self.data, f)
