
"use client"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import SentimentChart from "./sentiment-chart"
import SentimentTimeline from "./sentiment-timeline"
import { motion, AnimatePresence } from "framer-motion"
import { Youtube, ExternalLink, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function VideoAnalyzerPanel() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [videoThumbnail, setVideoThumbnail] = useState("")
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [videoTitle, setVideoTitle] = useState("")
  const [positive, setPositive] = useState(0)
  const [negative, setNegative] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [timeline, setTimeline] = useState([])
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [keyHighlights, setKeyHighlights] = useState<{ time: string; word: string; value: number ; sentiment: string}[]>([])

  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const exampleUrl = sessionStorage.getItem("exampleUrl")
      if (exampleUrl) {
        setUrl(exampleUrl)
        sessionStorage.removeItem("exampleUrl")
      }
    }
  }, [])

  const handleYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim() || isAnalyzing) return

    const videoId = extractYoutubeId(url)
    if (!videoId) {
      alert("Please enter a valid YouTube URL")
      return
    }

    setVideoThumbnail(`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`)
    startAnalysis()
  }

  const extractYoutubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const startAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(10)
    setAnalysisComplete(false)

    try {
      const response = await fetch("http://localhost:8000/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, usar_neutro: false })
      })
      
      const data = await response.json()

      setPositive(data.positive || 0)
      setNegative(data.negative || 0)
      setNeutral(data.neutral || 0)
      setTimeline(data.timeline || [])
      setSummary(data.resumen || "Sin resumen disponible")
      setKeyHighlights(
        (data.timeline || []).filter((item: any) =>
          (item.value >= 95 || item.value <= 25) &&
          typeof item.word === "string" &&
          typeof item.sentimiento === "string" &&
          ["positivo", "negativo", "neutral"].includes(item.sentimiento.toLowerCase())
        ).map((item: any) => ({
          ...item,
          sentiment: item.sentimiento.toLowerCase() // 👈 renombra para usarlo más abajo
        }))
      )
      console.log("Highlights procesados:", keyHighlights)


      
      setAnalysisProgress(100)
      setIsAnalyzing(false)
      setAnalysisComplete(true)


    } catch (error) {
      console.error("Analysis error:", error)
      alert("Error analyzing video. Please try again.")
      setIsAnalyzing(false)
      setAnalysisProgress(0)
    }

  }

  const resetAnalysis = () => {
    setUrl("")
    setVideoTitle("")
    setVideoThumbnail("")
    setIsAnalyzing(false)
    setAnalysisComplete(false)
    setAnalysisProgress(0)
  }


  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gm-darkblue dark:text-gm-blue">YouTube Video Sentiment Analyzer</h1>
      <p className="text-muted-foreground mb-8">
        Paste a YouTube video link to analyze the sentiment throughout the content.
      </p>

      {!analysisComplete && !isAnalyzing ? (
        <div className="bg-white dark:bg-gm-navy rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gm-blue/20">
          <form onSubmit={handleYoutubeSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="youtube-url">YouTube Video URL</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Youtube className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                  </div>
                  <Input
                    id="youtube-url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="pl-10 focus-visible:ring-gm-blue dark:border-gm-navy/80"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!url.trim()}
                  className="bg-gm-blue hover:bg-gm-darkblue text-white"
                >
                  Analyze
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter a YouTube URL to analyze the sentiment of the video content.
            </p>
          </form>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key="analysis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gm-navy rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gm-blue/20">
              <div className="flex flex-col md:flex-row gap-4">
                {videoThumbnail && (
                  <div className="md:w-1/3">
                    <img
                      src={videoThumbnail}
                      alt="Video thumbnail"
                      className="rounded-md w-full h-auto object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=180&width=320"
                      }}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2 text-gm-darkblue dark:text-white">{videoTitle}</h2>
                  <div className="flex items-center text-sm text-gm-blue dark:text-gm-lightblue mb-4">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <Youtube className="h-4 w-4 mr-1" />
                      View on YouTube
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>

                  {isAnalyzing && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
                      <Loader2 className="animate-spin h-5 w-5 text-gm-blue" />
                      Analyzing video sentiment...
                    </div>
                  )}

                  {analysisComplete && (
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      <div className="text-center md:text-left">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Overall sentiment</p>
                        <p
                         className={`text-xl font-bold ${
                          positive >= negative && positive >= neutral
                            ? "text-green-600 dark:text-green-400"
                            : negative >= positive && negative >= neutral
                            ? "text-red-600 dark:text-red-400"
                            : "text-yellow-600 dark:text-yellow-400"
                        }`}
                        >
                          {positive >= negative && positive >= neutral
                          ? "Positive"
                          : negative >= positive && negative >= neutral
                          ? "Negative"
                          : "Neutral"}
                        </p>
                      </div>
                      <div className="flex-1 flex justify-end">
                        <Button
                          variant="outline"
                          onClick={resetAnalysis}
                          className="border-gm-blue text-gm-blue hover:bg-gm-blue/10 dark:border-gm-lightblue dark:text-gm-lightblue dark:hover:bg-gm-blue/20"
                        >
                          Analyze Another Video
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {analysisComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div className="bg-white dark:bg-gm-navy rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gm-blue/20">
                  <div className="md:col-span-1 bg-white dark:bg-[#0170CE] p-4 rounded-2xl shadow max-h-[300px] overflow-y-auto border mb-5">
                    <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Summary of the Video</h2>
                    <p className="text-sm whitespace-pre-line text-gray-800 dark:text-white">{summary}</p>
                  </div>
                  <h3 className="text-lg font-semibold mb-4 text-gm-darkblue dark:text-white">Sentiment Breakdown</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        This pie chart shows the overall distribution of sentiments expressed in the video review:
                        positive, negative, and neutral. It's a quick summary of the review's emotional tone.
                      </p>
                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    <div className="min-h-[300px]">
                      <SentimentChart  positive={positive} negative={negative} neutral={neutral} />
                    </div>

                    <div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {positive}%
                          </div>
                          <div className="text-sm">Positive</div>
                        </div>
                        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {negative}%
                          </div>
                          <div className="text-sm">Negative</div>
                        </div>
                        <div className="p-4 rounded-lg bg-red-50 dark:bg-yellow-900/20">
                          <div className="text-2xl font-bold text-red-600 dark:text-yellow-400">
                            {neutral}%
                          </div>
                          <div className="text-sm">Neutral</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gm-navy rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gm-blue/20">
                  <h3 className="text-lg font-semibold mb-4 text-gm-darkblue dark:text-white">Sentiment Timeline</h3>
                  <div className="w-full overflow-x-auto">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        The sentiment timeline below displays how the reviewer's sentiment changes throughout the video.
                        Each point corresponds to a moment in time where the car or its features are discussed.
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        Values between <span className="font-medium text-red-600 dark:text-red-400">0 - 32</span> are negative, 
                        between <span className="font-medium text-yellow-600 dark:text-yellow-400">33 - 65</span> neutral, 
                        and between <span className="font-medium text-green-600 dark:text-green-400">66 - 100</span>  positive.
                      </p>
                    <div className="min-w-[700px]">
                      <SentimentTimeline data={timeline} />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <h4 className="text-lg font-medium text-gm-darkblue dark:text-white">Key Highlights</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      This section shows the most emotionally intense moments from the video, either 
                      <span className="font-semibold text-green-600 dark:text-green-400"> strongly positive</span> (value ≥ 95) or 
                      <span className="font-semibold text-red-600 dark:text-red-400"> strongly negative</span> (value ≤ 25), based on detected keywords.
                    </p>
                    <div className={`grid gap-4 ${keyHighlights.length > 10 ? 'md:grid-cols-3' : 'grid-cols-1'}`}>
                      {keyHighlights.map((item, index) => {
                        let badgeClass = ""
                        let description = ""

                        if (item.sentiment === "positivo") {
                          badgeClass = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          description = "Strong positive sentiment detected"
                        } else if (item.sentiment === "negativo") {
                          badgeClass = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          description = "Significant negative sentiment"
                        } else {
                          badgeClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          description = "Neutral or mixed opinion"
                        }

                        return (
                          <div key={index} className="flex items-start gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded font-mono ${badgeClass}`}>
                              {item.time} — <strong>{item.word}</strong> ({item.value})
                            </span>
                            <span className="text-sm">{description}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}