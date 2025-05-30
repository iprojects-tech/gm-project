"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ExamplePrompt {
  title: string
  description: string
  category: "chat" | "analyzer"
  prompt?: string
  url?: string
}

const examples: ExamplePrompt[] = [
  {
    title: "Workplace etiquette",
    description: "Get advice on professional behavior in the workplace",
    category: "chat",
    prompt: "What are the best practices for workplace etiquette in a remote team?",
  },
  {
    title: "Coding standards",
    description: "Learn about programming best practices",
    category: "chat",
    prompt: "What are the best coding standards for a TypeScript project?",
  },
  {
    title: "Meeting efficiency",
    description: "Tips for running effective meetings",
    category: "chat",
    prompt: "What are best practices for running efficient team meetings?",
  },
  {
    title: "Product review",
    description: "Analyze sentiment in product review videos",
    category: "analyzer",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    title: "Tutorial quality",
    description: "Evaluate sentiment in educational content",
    category: "analyzer",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    title: "Customer testimonial",
    description: "Analyze sentiment in customer feedback videos",
    category: "analyzer",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
]

export default function ExamplePrompts() {
  const router = useRouter()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleExampleClick = (example: ExamplePrompt) => {
    if (example.category === "chat" && example.prompt) {
      // Store the prompt in sessionStorage to be used in the chat page
      sessionStorage.setItem("examplePrompt", example.prompt)
      router.push("/chat")
    } else if (example.category === "analyzer" && example.url) {
      // Store the URL in sessionStorage to be used in the analyzer page
      sessionStorage.setItem("exampleUrl", example.url)
      router.push("/analyzer")
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {examples.map((example, index) => (
        <Card
          key={index}
          className={cn(
            "p-4 cursor-pointer transition-all border border-gray-200 dark:border-gm-blue/20 hover:border-gm-blue dark:hover:border-gm-blue hover:shadow-md",
            hoveredIndex === index ? "bg-gm-lightgray dark:bg-gm-blue/10" : "",
          )}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => handleExampleClick(example)}
        >
          <div className="space-y-2">
            <h3 className="font-medium text-gm-darkblue dark:text-white uppercase">{example.title}</h3>
            <p className="text-sm text-muted-foreground">{example.description}</p>
            <div className="text-xs text-gm-gray dark:text-gray-400 mt-2">
              {example.category === "chat" ? "Chatbot" : "Video Analyzer"}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
