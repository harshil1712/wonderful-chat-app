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
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-8`}>
      <div
        className={`flex flex-col max-w-3xl w-full ${isUser ? "items-end" : "items-start"}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <span 
            className="text-xs font-bold px-2 py-0.5"
            style={{
              backgroundColor: isUser ? 'var(--theme-text-primary)' : 'var(--theme-surface-hover)',
              color: isUser ? 'var(--theme-bg-base)' : 'var(--theme-bg-base)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {isUser ? "User" : "System"}
          </span>
          {message.createdAt && (
            <span 
              className="text-xs font-bold uppercase"
              style={{ color: 'var(--theme-text-subtle)', letterSpacing: '0.05em' }}
            >
              {formatTime(message.createdAt)}
            </span>
          )}
        </div>
        
        <div 
          className="py-2 w-full"
          style={{
            color: 'var(--theme-text-primary)',
            textAlign: isUser ? 'right' : 'left',
          }}
        >
          {message.parts.map((part, idx) => {
            if (part.type === "text") {
              return (
                <p
                  key={idx}
                  className={`whitespace-pre-wrap break-words ${isUser ? "text-xl font-medium" : "text-lg font-normal"}`}
                  style={{
                    lineHeight: '1.6',
                    fontFamily: isUser ? 'var(--font-heading)' : 'var(--font-ui)',
                    letterSpacing: isUser ? '-0.02em' : 'normal',
                  }}
                >
                  {part.content}
                </p>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
