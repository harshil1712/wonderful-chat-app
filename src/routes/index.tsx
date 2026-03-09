import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "@/components/ChatMessage";
import UnifiedInput from "@/components/UnifiedInput";
import { Surface, Loader, Badge } from "@cloudflare/kumo";
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";
import { getModelsForCapability, getDefaultModelId } from "@/config/models";
import { Send, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({ component: ChatPage });

function ChatPage() {
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    // Initialize from localStorage or default
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("selected-chat-model") || getDefaultModelId("chat")
      );
    }
    return getDefaultModelId("chat");
  });

  const [message, setMessage] = useState("");

  const { messages, sendMessage, isLoading } = useChat({
    connection: fetchServerSentEvents("/api/chat"),
    body: { model: selectedModel },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <div className="page-root">
      <div className="page-main">
        <div className="page-container">
          {/* Empty State */}
          {isEmpty && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-scale-in">
              <div
                className="mb-6 p-6 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, var(--theme-accent-subtle), transparent)",
                }}
              >
                <Sparkles
                  size={48}
                  strokeWidth={1.5}
                  style={{ color: "var(--theme-accent)" }}
                />
              </div>
              <h2
                className="text-4xl font-bold mb-4 text-center"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--theme-text-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                Let's create something wonderful
              </h2>
              <p
                className="text-lg text-center max-w-md mb-8"
                style={{ color: "var(--theme-text-secondary)" }}
              >
                Start a conversation with AI. Ask questions, explore ideas, or
                get help with your work.
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.map((message, idx) => (
            <div
              key={message.id}
              className="message-enter"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <ChatMessage message={message} />
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start mb-4 animate-slide-up">
              <div className="flex flex-col max-w-[70%] items-start">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <Badge variant="secondary">Assistant</Badge>
                </div>
                <Surface
                  className="px-5 py-4 rounded-2xl rounded-bl-sm"
                  style={{
                    backgroundColor: "var(--theme-bg-elevated)",
                    border: "1px solid var(--theme-border-light)",
                    boxShadow: "var(--theme-shadow-sm)",
                  }}
                >
                  <Loader size="sm" />
                </Surface>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="page-footer">
        <div className="page-footer-inner">
          <UnifiedInput
            mode="text"
            placeholder="Type your message..."
            rows={1}
            value={message}
            onChange={setMessage}
            models={getModelsForCapability("chat")}
            defaultModelId={getDefaultModelId("chat")}
            storageKey="selected-chat-model"
            onModelChange={setSelectedModel}
            actionLabel="Send"
            actionIcon={<Send size={18} />}
            onAction={() => sendMessage(message)}
            disabled={isLoading}
            loading={isLoading}
            loadingLabel="Sending..."
            showKeyboardHints
            submitOnEnter
          />
        </div>
      </div>
    </div>
  );
}
