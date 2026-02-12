import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { Surface, Loader, Badge } from "@cloudflare/kumo";
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";

export const Route = createFileRoute("/")({ component: ChatPage });

function ChatPage() {
  const { messages, sendMessage, isLoading } = useChat({
    connection: fetchServerSentEvents("/api/chat"),
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-kumo-page">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
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
      <ChatInput sendMessage={sendMessage} disabled={isLoading} />
    </div>
  );
}
