import { Surface } from "@cloudflare/kumo";
import { UIMessage } from "@tanstack/ai-react";

export default function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div
        className={`flex flex-col max-w-[75%] ${isUser ? "items-end" : "items-start"}`}
      >
        <div className="flex items-center gap-2 mb-2 px-1">
          <span 
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: isUser ? 'var(--theme-accent)' : 'var(--theme-surface-hover)',
              color: isUser ? 'white' : 'var(--theme-text-secondary)',
            }}
          >
            {isUser ? "You" : "Assistant"}
          </span>
          {message.createdAt && (
            <span 
              className="text-xs"
              style={{ color: 'var(--theme-text-subtle)' }}
            >
              {formatTime(message.createdAt)}
            </span>
          )}
        </div>
        <Surface
          className={`px-5 py-4 rounded-2xl ${
            isUser
              ? "rounded-br-sm"
              : "rounded-bl-sm"
          }`}
          style={{
            background: isUser 
              ? 'linear-gradient(135deg, var(--theme-accent), var(--theme-accent-light))'
              : 'var(--theme-bg-elevated)',
            color: isUser ? 'white' : 'var(--theme-text-primary)',
            border: isUser ? 'none' : '1px solid var(--theme-border-light)',
            boxShadow: isUser ? 'var(--theme-shadow)' : 'var(--theme-shadow-sm)',
          }}
        >
          {message.parts.map((part, idx) => {
            if (part.type === "text") {
              return (
                <p
                  key={idx}
                  className="whitespace-pre-wrap break-words"
                  style={{
                    lineHeight: '1.7',
                    letterSpacing: '0.01em',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  {part.content}
                </p>
              );
            }
            return null;
          })}
        </Surface>
      </div>
    </div>
  );
}
