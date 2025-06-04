from flask import Flask, request, jsonify
from app import query_bot  # Importamos la función existente

app = Flask(__name__)

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    pregunta = data.get("mensaje", "")
    respuesta = query_bot(pregunta)
    return jsonify({"respuesta": respuesta})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)