import { MessageSquare } from 'lucide-react'
import { Surface, Text } from '@cloudflare/kumo'

export default function Header() {
  return (
    <Surface as="header" className="border-b shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
        <MessageSquare size={28} className="text-kumo-link" />
        <Text variant="heading2" as="h1">
          Wonderful Chat
        </Text>
      </div>
    </Surface>
  )
}
