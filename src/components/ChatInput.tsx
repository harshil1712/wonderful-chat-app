import { useState, useRef, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button, Surface } from "@cloudflare/kumo";

interface ChatInputProps {
  sendMessage: (content: string) => void;
  disabled?: boolean;
}

export default function ChatInput({
  sendMessage,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      sendMessage(trimmedMessage);
      setMessage("");

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <Surface className="border-t p-4 sticky bottom-0 z-10">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto flex items-end gap-3"
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
          disabled={disabled}
          className="flex-1 bg-kumo-control text-kumo-default placeholder-kumo-subtle rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-kumo-ring disabled:opacity-50 disabled:cursor-not-allowed max-h-32 overflow-y-auto border border-kumo-line"
          rows={1}
        />
        <Button
          onClick={handleSubmit}
          disabled={disabled || !message.trim()}
          variant="primary"
          shape="circle"
          aria-label="Send message"
          icon={<Send size={20} />}
        />
      </form>
    </Surface>
  );
}
