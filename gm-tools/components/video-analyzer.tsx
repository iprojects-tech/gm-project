"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Youtube, ExternalLink } from "lucide-react"
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
    neutral: 25,
    negative: 10,
  })
  const [timelineData, setTimelineData] = useState<Array<{ time: string; sentiment: string; value: number }>>([])

  // Check for example URL from home page
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

    // Extract video ID from URL
    const videoId = extractYoutubeId(youtubeUrl)
    if (!videoId) {
      alert("Please enter a valid YouTube URL")
      return
    }

    // Set video details
    setVideoTitle("Sample YouTube Video")
    setVideoThumbnail(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)

    // Start analysis
    startAnalysis()
  }

  const extractYoutubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const startAnalysis = () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setAnalysisComplete(false)

    // Simulate analysis process with progress updates
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        const newProgress = prev + Math.floor(Math.random() * 10) + 5
        if (newProgress >= 100) {
          clearInterval(interval)
          completeAnalysis()
          return 100
        }
        return newProgress
      })
    }, 500)
  }

  const completeAnalysis = () => {
    // Generate random sentiment data for demo
    const positive = Math.floor(Math.random() * 60) + 20 // 20-80
    const negative = Math.floor(Math.random() * 30) // 0-30
    const neutral = 100 - positive - negative

    setSentimentData({
      positive,
      neutral,
      negative,
    })

    // Generate random timeline data for demo
    const newTimelineData = []
    for (let i = 0; i < 10; i++) {
      const minute = Math.floor(i * 0.5)
      const second = Math.floor(Math.random() * 59)
      const time = `${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`

      let sentiment
      let value

      if (i < 3) {
        sentiment = "neutral"
        value = Math.floor(Math.random() * 30) + 40 // 40-70
      } else if (i < 6) {
        sentiment = "positive"
        value = Math.floor(Math.random() * 30) + 60 // 60-90
      } else if (i < 8) {
        sentiment = "negative"
        value = Math.floor(Math.random() * 30) + 60 // 60-90 (but negative)
      } else {
        sentiment = "neutral"
        value = Math.floor(Math.random() * 20) + 40 // 40-60
      }

      newTimelineData.push({ time, sentiment, value })
    }

    setTimelineData(newTimelineData)

    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    }, 500)
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
    <div className="max-w-4xl mx-auto p-4 md:p-8">
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
            {/* Video info */}
            <div className="bg-white dark:bg-gm-navy rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gm-blue/20">
              <div className="flex flex-col md:flex-row gap-4">
                {videoThumbnail && (
                  <div className="md:w-1/3">
                    <img
                      src={videoThumbnail || "/placeholder.svg"}
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
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Analyzing video sentiment...</span>
                        <span>{analysisProgress}%</span>
                      </div>
                      <Progress value={analysisProgress} className="h-2 bg-gray-200 dark:bg-gm-navy/80">
                        <div className="h-full bg-gm-blue rounded-full" style={{ width: `${analysisProgress}%` }} />
                      </Progress>
                    </div>
                  )}

                  {analysisComplete && (
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      <div className="text-center md:text-left">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Overall sentiment</p>
                        <p
                          className={`text-xl font-bold ${
                            sentimentData.positive > 60
                              ? "text-green-600 dark:text-green-400"
                              : sentimentData.negative > 30
                                ? "text-red-600 dark:text-red-400"
                                : "text-gm-blue dark:text-gm-lightblue"
                          }`}
                        >
                          {sentimentData.positive > 60
                            ? "Positive"
                            : sentimentData.negative > 30
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

            {/* Analysis results */}
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
                    <div>
                      <SentimentChart data={sentimentData} />
                    </div>

                    <div>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {sentimentData.positive}%
                          </div>
                          <div className="text-sm">Positive</div>
                        </div>
                        <div className="p-4 rounded-lg bg-gm-lightgray dark:bg-gm-blue/20">
                          <div className="text-2xl font-bold text-gm-blue dark:text-gm-lightblue">
                            {sentimentData.neutral}%
                          </div>
                          <div className="text-sm">Neutral</div>
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
                  <SentimentTimeline data={timelineData} />

                  <div className="mt-6 space-y-3">
                    <h4 className="text-sm font-medium text-gm-darkblue dark:text-white">Key Highlights</h4>
                    <ul className="space-y-2">
                      {timelineData
                        .filter((item, index) => index % 3 === 0 || item.sentiment !== "neutral")
                        .slice(0, 3)
                        .map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span
                              className={`text-xs px-2 py-0.5 rounded ${
                                item.sentiment === "positive"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : item.sentiment === "negative"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                    : "bg-gm-lightgray text-gm-darkblue dark:bg-gm-blue/20 dark:text-gm-lightblue"
                              }`}
                            >
                              {item.time}
                            </span>
                            <span>
                              {item.sentiment === "positive"
                                ? "Strong positive sentiment detected"
                                : item.sentiment === "negative"
                                  ? "Significant negative sentiment"
                                  : "Neutral sentiment observed"}
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
