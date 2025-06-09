"use client"
import React, { useState } from "react"
import DirectorySelector from "@/components/DirectorySelector"
import ChatPanel from "@/components/chat-panel"
import ChatInterface from "@/components/chat-interface"

export default function ChatbotPage() {
  const [ready, setReady] = useState(false)
  return (
    <div>
      {!ready && <DirectorySelector onProcessed={() => setReady(true)} />}
      {ready && <ChatInterface />}
    </div>
  )
}
