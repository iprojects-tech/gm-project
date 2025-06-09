// /components/DirectorySelector.tsx (debería existir)
import React, { useState } from "react"

export default function DirectorySelector({ onProcessed }: { onProcessed: () => void }) {
  const [path, setPath] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("")

  const handleAnalyze = async () => {
    setLoading(true)
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

    // Polling de progreso
    const interval = setInterval(async () => {
      const pr = await fetch("http://localhost:8000/progress")
      const data = await pr.json()
      setProgress(data.progress)

      console.log(data)
      console.log(pr)
    
      if (data.done) {
        clearInterval(interval)
        setLoading(false)
        setMessage("¡Listo!")
        onProcessed()
      }
    }, 1000)
  }

  return (
    <div className="p-8 flex flex-col items-center">
      <input
        className="border p-2 w-80"
        type="text"
        value={path}
        onChange={e => setPath(e.target.value)}
        placeholder="Pon el path del directorio a analizar"
        disabled={loading}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
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
      {!loading && message && <div className="mt-4 text-green-600">{message}</div>}
    </div>
  )
}
