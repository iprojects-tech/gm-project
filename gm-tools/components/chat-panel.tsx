"use client"

import React, { useState, useRef, useEffect } from "react"
import { Send, Bot, User } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import ImageThumbnails, { ImageData } from "./MiniImages"


type Message = {
  id: number
  role: "user" | "bot"
  content: string
  sources?: string[]
  images?: ImageData[]
}

const initialMessages: Message[] = [
  { id: 1, role: "bot", content: "Hello! Welcome to the Best Practices AI chatbot. How can I help you today?" },
]

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { id: Date.now(), role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }), // <-- CAMBIO A "question"
      })

      if (!res.ok) throw new Error("Server response error")

      const data = await res.json()
      // data: { answer: string, sources: string[], images: string[] }

      const botMessage: Message = {
        id: Date.now() + 1,
        role: "bot",
        content: data.answer?.trim() || "Sorry, I couldn't get an answer.",
        sources: data.sources || [],
        images: data.images || [],
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMsg: Message = {
        id: Date.now() + 1,
        role: "bot",
        content: "Sorry, there was an error processing your request.",
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <Card className="h-full flex flex-col max-w-[60%] mx-auto pt-5 mt-10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Bot size={20} className="text-primary" />
          Best Practices AI Chatbot
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                >
                  <div
                    className={`p-2 rounded-full ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                  >
                    {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div
                    className={`p-3 rounded-lg ${message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted rounded-tl-none"
                      }`}
                  >
                    <p>{message.content}</p>
                    {/* IMÁGENES */}

                    {message.images && message.images.length > 0 && (
                      <>
                        {console.log("DEBUG: message.images", message.images)}
                        <ImageThumbnails images={message.images} />
                      </>
                    )}



                    {/* FUENTES */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        <strong>Sources:</strong>
                        {message.sources.map((source, i) => (
                          <pre
                            key={i}
                            className="whitespace-pre-wrap mb-2 bg-gray-100 p-2 rounded"
                          >
                            {source}
                          </pre>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <div className="p-2 rounded-full bg-muted">
                    <Bot size={16} />
                  </div>
                  <div className="p-3 rounded-lg bg-muted rounded-tl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-2">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" disabled={isTyping || !input.trim()}>
            <Send size={18} />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
