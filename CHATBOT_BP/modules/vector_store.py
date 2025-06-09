import os
import faiss
import pickle
import numpy as np

class VectorStore:
    def __init__(self, dim=512):
        self.index_path = os.path.join("storage", "index.faiss")
        self.data_path = os.path.join("storage", "data.pkl")
        self.dim = dim
        self.data = []
        if os.path.exists(self.index_path) and os.path.exists(self.data_path):
            self.index = faiss.read_index(self.index_path)
            with open(self.data_path, "rb") as f:
                self.data = pickle.load(f)
        else:
            self.index = faiss.IndexFlatL2(dim)

    def add(self, embeddings, chunks):
        arr = np.array(embeddings, dtype="float32")
        print("FAISS espera dimensión:", self.dim)
        print("Embeddings tienen shape:", arr.shape)

        self.index.add(arr)
        self.data.extend(chunks)
        self._save()

    def _save(self):
        faiss.write_index(self.index, self.index_path)
        with open(self.data_path, "wb") as f:
            pickle.dump(self.data, f)

    def search(self, query_embedding, top_k=5):
        arr = np.array([query_embedding], dtype="float32")
        D, I = self.index.search(arr, top_k)
        return [self.data[i] for i in I[0] if i < len(self.data)]
