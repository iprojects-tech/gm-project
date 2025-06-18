import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DirectorySelector({ onProcessed }: { onProcessed: () => void }) {
  const [path, setPath] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("")
  const [canContinue, setCanContinue] = useState(false)
  const [finishedProcessing, setFinishedProcessing] = useState(false) // <--- NUEVO

  const router = useRouter()

  useEffect(() => {
    const checkKnowledge = async () => {
      try {
        const res = await fetch("http://localhost:8000/progress")
        const data = await res.json()
        if (data.done) {
          setCanContinue(true)
          setProgress(data.progress || 100)
        }
      } catch (err) {
        // Ignora si no conecta
      }
    }
    checkKnowledge()
  }, [])

  const handleAnalyze = async () => {
    setLoading(true)
    setFinishedProcessing(false)  // <-- Reset para nuevos análisis
    setMessage("Procesando documentos...")

    const res = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    })
    const data = await res.json()
    if (!res.ok || data.message.includes("0 files")) {
      setMessage("No se encontraron documentos en la ruta dada.")
      setLoading(false)
      return
    }

    const interval = setInterval(async () => {
      const pr = await fetch("http://localhost:8000/progress")
      const data = await pr.json()
      setProgress(data.progress)
      if (data.done) {
        clearInterval(interval)
        setLoading(false)
        setCanContinue(true)
        setFinishedProcessing(true)   // <-- Ya terminó, espera acción del usuario
        setMessage("¡Listo! Documentos procesados, puedes continuar al chat.")
      }
    }, 1000)
  }

  // Botón para continuar al chat
  const handleContinue = () => {
    onProcessed()
  }

  return (
    <div className="p-8 flex flex-col items-center">
      <div className="my-8 text-center">
        <h1 className="text-4xl font-semibold mb-7 text-white">
          ¡Bienvenido al Chatbot de Best Practices!
        </h1>
        <p className="text-muted-foreground text-lg">
          Selecciona una carpeta con tus documentos para que el bot pueda analizarlos.<br />
          O si ya analizaste documentos antes, simplemente <span className="font-semibold text-green-700">continúa con el conocimiento existente</span>.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-0 mt-10 w-full max-w-[40%]">
        {/* Lado izquierdo: Input y procesar */}
        <div className="flex flex-col items-center flex-1 w-full">
          <input
            className="border rounded-lg p-3 w-80 mb-4 text-lg"
            type="text"
            value={path}
            onChange={e => setPath(e.target.value)}
            placeholder="Ingresa el path del directorio a analizar"
            disabled={loading}
          />
          <button
            className="bg-blue-600 hover:bg-blue-500 transition text-white px-4 py-3 rounded w-80 text-lg font-semibold"
            onClick={handleAnalyze}
            disabled={loading || !path}
          >
            {loading ? "Procesando..." : "Procesar documentos"}
          </button>
          {loading && (
            <div className="w-80 mt-4">
              <div className="bg-gray-200 h-2 rounded">
                <div className="bg-blue-600 h-2 rounded" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-2 text-sm">{message} ({progress}%)</div>
            </div>
          )}
          {/* Cuando ya terminó de procesar, mensaje final y botón continuar */}
          {finishedProcessing && !loading && (
            <div className="mt-4 flex flex-col items-center">
              <div className="text-green-600">{message}</div>
              <button
                className="mt-4 bg-green-600 hover:bg-green-500 transition text-white px-4 py-3 rounded w-80 text-lg font-semibold"
                onClick={handleContinue}
              >
                Continuar al chat
              </button>
            </div>
          )}
          {/* Si hubo error (no loading, no finished, pero hay mensaje) */}
          {!loading && !finishedProcessing && message && <div className="mt-4 text-green-600">{message}</div>}
        </div>

        {/* Separador vertical */}
        <div className="hidden md:block w-px bg-muted-foreground h-32 mx-6" />

        {/* Lado derecho: Botón continuar con embeddings existentes */}
        <div className="flex flex-col items-center flex-1 w-full">
          <button
            className="bg-green-600 hover:bg-green-500 transition text-white px-4 py-3 rounded w-80 text-lg font-semibold"
            onClick={handleContinue}
            disabled={loading || !canContinue}
          >
            Usar chatbot con conocimiento existente
          </button>
          {!canContinue && (
            <span className="mt-2 text-xs text-gray-400 text-center">
              (Primero analiza documentos para activar esta opción)
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
