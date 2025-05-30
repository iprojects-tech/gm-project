import ChatInterface from "@/components/chat-interface"

export default function ChatbotPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI Best Practices Chatbot</h1>
      <p className="text-muted-foreground mb-6">
        Ask questions about workplace behavior, coding standards, safety protocols, and other best practices.
      </p>
      <ChatInterface />
    </div>
  )
}
