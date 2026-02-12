import { Badge, Surface, Text } from '@cloudflare/kumo'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user'
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex flex-col max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 mb-1 px-1">
          <Badge variant={isUser ? 'primary' : 'secondary'}>
            {isUser ? 'You' : 'Assistant'}
          </Badge>
          <Text variant="secondary" size="xs">
            {formatTime(timestamp)}
          </Text>
        </div>
        <Surface
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-kumo-brand text-kumo-inverse rounded-br-sm'
              : 'rounded-bl-sm'
          }`}
        >
          <p className="whitespace-pre-wrap break-words leading-relaxed text-kumo-default">
            {content}
          </p>
        </Surface>
      </div>
    </div>
  )
}
