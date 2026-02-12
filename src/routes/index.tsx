import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import ChatMessage from '@/components/ChatMessage'
import ChatInput from '@/components/ChatInput'
import { Surface, Loader, Badge } from '@cloudflare/kumo'

export const Route = createFileRoute('/')({ component: ChatPage })

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ])
  const [isAssistantTyping, setIsAssistantTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    
    setMessages((prev) => [...prev, userMessage])
    setIsAssistantTyping(true)

    // Simulate assistant response after a delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAssistantResponse(content),
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, assistantMessage])
      setIsAssistantTyping(false)
    }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds
  }

  // Simple mock assistant response generator
  const generateAssistantResponse = (userMessage: string): string => {
    const responses = [
      `I understand you said: "${userMessage}". That's interesting! Tell me more.`,
      `Thanks for sharing that. I'm processing: "${userMessage}". What else would you like to know?`,
      `Got it! Regarding "${userMessage}", I'd be happy to help with that.`,
      `That's a great point about "${userMessage}". Let me think about that for a moment.`,
      `Interesting question! About "${userMessage}" - I'd say that depends on several factors.`,
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-kumo-page">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))}
          
          {isAssistantTyping && (
            <div className="flex justify-start mb-4">
              <div className="flex flex-col max-w-[70%] items-start">
                <div className="flex items-center gap-2 mb-1 px-1">
                  <Badge variant="secondary">Assistant</Badge>
                </div>
                <Surface className="px-4 py-3 rounded-2xl rounded-bl-sm">
                  <Loader size="sm" />
                </Surface>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={isAssistantTyping}
      />
    </div>
  )
}
