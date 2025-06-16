"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Youtube, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import SentimentChart from "./sentiment-chart"
import SentimentTimeline from "./sentiment-timeline"

export default function VideoAnalyzer() {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [videoTitle, setVideoTitle] = useState("")
  const [videoThumbnail, setVideoThumbnail] = useState("")
  const [sentimentData, setSentimentData] = useState({
    positive: 65,
    negative: 10,
  })
  const [timelineData, setTimelineData] = useState<Array<{ time: string; sentiment: string; value: number }>>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const exampleUrl = sessionStorage.getItem("exampleUrl")
      if (exampleUrl) {
        setYoutubeUrl(exampleUrl)
        sessionStorage.removeItem("exampleUrl")
      }
    }
  }, [])

  const handleYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!youtubeUrl.trim() || isAnalyzing) return

    const videoId = extractYoutubeId(youtubeUrl)
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
      const response = await fetch("http://localhost:8080/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeUrl }),
      })

      const result = await response.json()

      if (result.error) throw new Error(result.error)

      setSentimentData({
        positive: result.positive,
        negative: result.negative,
      })

      setTimelineData(result.timeline || [])

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
    setYoutubeUrl("")
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
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="pl-10 focus-visible:ring-gm-blue dark:border-gm-navy/80"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!youtubeUrl.trim()}
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
                    <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
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
                            sentimentData.positive > sentimentData.negative
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {sentimentData.positive > sentimentData.negative ? "Positive" : "Negative"}
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
                  <h3 className="text-lg font-semibold mb-4 text-gm-darkblue dark:text-white">Sentiment Breakdown</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="min-h-[300px]">
                      <SentimentChart data={sentimentData} />
                    </div>

                    <div>
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {sentimentData.positive}%
                          </div>
                          <div className="text-sm">Positive</div>
                        </div>
                        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {sentimentData.negative}%
                          </div>
                          <div className="text-sm">Negative</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gm-navy rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gm-blue/20">
                  <h3 className="text-lg font-semibold mb-4 text-gm-darkblue dark:text-white">Sentiment Timeline</h3>
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[700px]">
                      <SentimentTimeline data={timelineData} />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <h4 className="text-sm font-medium text-gm-darkblue dark:text-white">Key Highlights</h4>
                    <ul className="space-y-2">
                      {timelineData
                        .filter((item, index) => index % 3 === 0)
                        .slice(0, 3)
                        .map((item, index) => (
                          <li key={`${item.time}-${index}`} className="flex items-start gap-2">
                            <span
                              className={`text-xs px-2 py-0.5 rounded ${
                                item.sentiment === "positive"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              }`}
                            >
                              {item.time}
                            </span>
                            <span>
                              {item.sentiment === "positive"
                                ? "Strong positive sentiment detected"
                                : "Significant negative sentiment"}
                            </span>
                          </li>
                        ))}
                    </ul>
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