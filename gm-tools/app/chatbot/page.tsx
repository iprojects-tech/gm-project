"use client"
import React, { useState } from "react"
import DirectorySelector from "@/components/DirectorySelector"
import ChatPanel from "@/components/chat-panel"

export default function ChatbotPage() {
  const [ready, setReady] = useState(false)
  return (
    <div>
      {!ready && <DirectorySelector onProcessed={() => setReady(true)} />}
      {ready && <ChatPanel />}
    </div>
  )
}
