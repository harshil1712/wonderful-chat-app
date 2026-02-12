import { Badge, Surface, Text } from "@cloudflare/kumo";
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
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`flex flex-col max-w-[70%] ${isUser ? "items-end" : "items-start"}`}
      >
        <div className="flex items-center gap-2 mb-1 px-1">
          <Badge variant={isUser ? "primary" : "secondary"}>
            {isUser ? "You" : "Assistant"}
          </Badge>
          {message.createdAt && (
            <Text variant="secondary" size="xs">
              {formatTime(message.createdAt)}
            </Text>
          )}
        </div>
        <Surface
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-kumo-brand text-kumo-inverse rounded-br-sm"
              : "rounded-bl-sm"
          }`}
        >
          {message.parts.map((part, idx) => {
            if (part.type === "text") {
              return (
                <p
                  key={idx}
                  className="whitespace-pre-wrap wrap-break-word leading-relaxed text-kumo-default"
                >
                  {part.content}
                </p>
              );
            }
            // Handle other part types (e.g., images, code blocks) if needed
            return null;
          })}
        </Surface>
      </div>
    </div>
  );
}
