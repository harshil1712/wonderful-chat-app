import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "@/components/ChatMessage";
import UnifiedInput from "@/components/UnifiedInput";
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";
import { getModelsForCapability, getDefaultModelId } from "@/config/models";
import { Surface, Badge, Loader } from "@cloudflare/kumo";

export const Route = createFileRoute("/_authenticated/chat")({ component: ChatPage });

function ChatPage() {
  const [selectedModel, setSelectedModel] = useState<string>(() => {
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
        <div className="page-container" style={{ padding: isEmpty ? "4rem 1.5rem" : "2rem 1.5rem" }}>
          {isEmpty && (
            <div className="empty-state">
              <h2 className="empty-state-title">
                Wonderful
                <br />
                Chat.
              </h2>
              <p className="empty-state-subtitle mt-8">
                ARTIFICIAL INTELLIGENCE CONVERSATION INTERFACE
              </p>
            </div>
          )}

          {!isEmpty && (
            <div className="flex flex-col gap-8">
              {messages.map((chatMessage, idx) => (
                <div
                  key={chatMessage.id}
                  className="message-enter"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <ChatMessage message={chatMessage} />
                </div>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex justify-start mb-4 mt-8 animate-slide-up w-full">
              <div className="flex flex-col w-full max-w-3xl items-start">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="secondary"
                    className="rounded-none border border-black uppercase tracking-widest bg-black text-white font-bold"
                  >
                    SYSTEM
                  </Badge>
                </div>
                <div className="py-2">
                  <Loader size="sm" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <Surface className="page-footer rounded-none border-t border-black bg-white">
        <div className="page-footer-inner page-footer-inner-chat">
          <UnifiedInput
            mode="text"
            placeholder="ENTER COMMAND..."
            rows={1}
            value={message}
            onChange={setMessage}
            models={getModelsForCapability("chat")}
            defaultModelId={getDefaultModelId("chat")}
            storageKey="selected-chat-model"
            onModelChange={setSelectedModel}
            actionLabel="Execute"
            onAction={() => sendMessage(message)}
            disabled={isLoading}
            loading={isLoading}
            loadingLabel="Processing..."
            showKeyboardHints
            submitOnEnter
          />
        </div>
      </Surface>
    </div>
  );
}
