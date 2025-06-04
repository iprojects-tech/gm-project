
import requests

def ask_llm(context, question, model="mistral"):
    prompt = f"""
You are a helpful assistant. Answer the question based on the following context.

---CONTEXT---
{context}
---END---

Question: {question}
Answer:
    """
    response = requests.post(
        f"http://localhost:11434/api/generate",
        json={"model": model, "prompt": prompt, "stream": False}
    )
    return response.json()["response"]
