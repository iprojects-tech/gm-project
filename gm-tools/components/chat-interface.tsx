"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import ImageThumbnails, { ImageData } from "./MiniImages" 

type Message = {
  id: number
  role: "user" | "assistant"
  content: string
  sources?: string[]
  images?: ImageData[]
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello! I'm your AI assistant for best practices. Ask me about workplace etiquette, programming standards, safety procedures, or any other best practices you'd like to learn about.",
  },
]

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMessage: Message = { id: Date.now(), role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const sourcesArray: string[] | undefined = data.sources
      // data.images puede venir como array de objetos tipo ImageData o string, normalízalo aquí:
      const imagesArray: ImageData[] | undefined = data.images
        ? data.images.map((img: any) =>
            typeof img === "string"
              ? { src: img, source: "", page: undefined }
              : img
          )
        : []

      const botMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.answer || "Sorry, I couldn't get an answer.",
        sources: sourcesArray,
        images: imagesArray,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: `Error: ${(error as Error).message}`,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gm-darknavy p-4 md:p-0">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6 py-8">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "px-4 py-6 md:px-6 md:py-8 border-b border-gray-100 dark:border-gm-navy",
                    message.role === "user"
                      ? "bg-white dark:bg-gm-darknavy"
                      : "bg-[#f7f7f8] dark:bg-gm-navy"
                  )}
                >
                  <div className="max-w-3xl mx-auto flex flex-col">
                    <div className="flex">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center mr-4 mt-1",
                          message.role === "user"
                            ? "bg-gm-darkgray text-white dark:bg-gray-300 dark:text-gray-800"
                            : "bg-gm-blue text-white"
                        )}
                      >
                        {message.role === "user" ? "U" : "AI"}
                      </div>
                      {/* TEXTO MÁS GRANDE */}
                      <div className="flex-1 whitespace-pre-wrap text-lg">{message.content}</div>
                    </div>

                    {/* Mostrar images si existen */}
                    {message.role === "assistant" && message.images && message.images.length > 0 && (
                      <div className="my-8">
                        <ImageThumbnails images={message.images} />
                      </div>
                    )}

                    {/* Mostrar sources si existen, solo las 3 primeras */}
                    {message.role === "assistant" && message.sources && message.sources.length > 0 && (
                      <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
                        <strong>Sources:</strong>
                        {message.sources.slice(0, 3).map((source, i) => (
                          <pre
                            key={i}
                            className="whitespace-pre-wrap mb-2 bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono"
                          >
                            {source}
                          </pre>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-6 md:px-6 md:py-8 border-b border-gray-100 dark:border-gm-navy bg-[#f7f7f8] dark:bg-gm-navy"
              >
                <div className="max-w-3xl mx-auto flex">
                  <div className="w-7 h-7 rounded-full bg-gm-blue text-white flex items-center justify-center mr-4 mt-1">
                    AI
                  </div>
                  <div className="flex items-center">
                    <div className="flex space-x-1">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-gm-gray dark:bg-gm-lightblue/50"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                          delay: 0,
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-gm-gray dark:bg-gm-lightblue/50"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                          delay: 0.2,
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-gm-gray dark:bg-gm-lightblue/50"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "loop",
                          delay: 0.4,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-gm-navy bg-white dark:bg-gm-darknavy p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about best practices..."
              className="flex-1 border-gray-300 dark:border-gm-navy focus-visible:ring-gm-blue dark:focus-visible:ring-gm-blue"
              disabled={isTyping}
            />
            <Button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="bg-gm-blue hover:bg-gm-darkblue text-white"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            AI assistant provides advice on best practices based on general knowledge.
          </p>
        </div>
      </div>
    </div>
  )
}
