"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Youtube, FileVideo, Trash2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import SentimentChart from "./sentiment-chart"

export default function VideoAnalyzerPanel() {
  const [videoSource, setVideoSource] = useState<string | null>(null)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [fileName, setFileName] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [sentimentData, setSentimentData] = useState({
    positive: 65,
    neutral: 25,
    negative: 10,
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      // In a real app, you would handle the file upload here
      resetAnalysis()
    }
  }

  const handleYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (youtubeUrl.trim()) {
      // In a real app, you would validate and process the YouTube URL
      resetAnalysis()
    }
  }

  const resetAnalysis = () => {
    setAnalysisComplete(false)
    setIsAnalyzing(false)
  }

  const startAnalysis = () => {
    setIsAnalyzing(true)

    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
      // Mock sentiment data - in a real app this would come from your analysis
      setSentimentData({
        positive: Math.floor(Math.random() * 60) + 20, // 20-80
        neutral: Math.floor(Math.random() * 40) + 10, // 10-50
        negative: Math.floor(Math.random() * 30), // 0-30
      })
    }, 3000)
  }

  const clearVideo = () => {
    setVideoSource(null)
    setFileName("")
    setYoutubeUrl("")
    setAnalysisComplete(false)
    setIsAnalyzing(false)
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileVideo size={20} className="text-primary" />
          Video Sentiment Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        {!fileName && !youtubeUrl ? (
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="upload">Upload Video</TabsTrigger>
              <TabsTrigger value="youtube">YouTube Link</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop your video file here or click to browse
                </p>
                <Input
                  id="video-upload"
                  type="file"
                  accept="video/mp4"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Label htmlFor="video-upload" asChild>
                  <Button variant="outline" className="mt-2">
                    Select Video
                  </Button>
                </Label>
              </div>
            </TabsContent>
            <TabsContent value="youtube" className="space-y-4">
              <form onSubmit={handleYoutubeSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="youtube-url">YouTube Video URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="youtube-url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                    <Button type="submit" size="icon">
                      <Youtube size={18} />
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {youtubeUrl ? (
                  <Youtube size={20} className="text-red-500" />
                ) : (
                  <FileVideo size={20} className="text-blue-500" />
                )}
                <span className="font-medium truncate max-w-[200px]">{fileName || youtubeUrl}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={clearVideo} disabled={isAnalyzing}>
                <Trash2 size={18} />
              </Button>
            </div>

            {!isAnalyzing && !analysisComplete && (
              <Button className="w-full" onClick={startAnalysis}>
                Analyze Sentiment
              </Button>
            )}

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analyzing video...</span>
                  <span>Please wait</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            )}

            {analysisComplete && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-1">Sentiment Analysis Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Overall sentiment:{" "}
                    {sentimentData.positive > 60 ? "Positive" : sentimentData.negative > 30 ? "Negative" : "Neutral"}
                  </p>
                </div>

                <SentimentChart data={sentimentData} />

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {sentimentData.positive}%
                    </div>
                    <div className="text-xs">Positive</div>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{sentimentData.neutral}%</div>
                    <div className="text-xs">Neutral</div>
                  </div>
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                    <div className="text-lg font-bold text-red-600 dark:text-red-400">{sentimentData.negative}%</div>
                    <div className="text-xs">Negative</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Key Highlights</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded dark:bg-green-900/30 dark:text-green-300">
                        00:45
                      </span>
                      <span>Peak positive sentiment detected</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded dark:bg-red-900/30 dark:text-red-300">
                        02:17
                      </span>
                      <span>Significant negative shift</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded dark:bg-blue-900/30 dark:text-blue-300">
                        03:52
                      </span>
                      <span>Return to neutral tone</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 text-xs text-muted-foreground">
        Analyze video content for emotional tone and sentiment
      </CardFooter>
    </Card>
  )
}
