import { useState, useRef, KeyboardEvent, useEffect } from "react";
import type { ModelConfig } from "@/config/models";
import { Upload } from "lucide-react";
import { Button, Select } from "@cloudflare/kumo";

interface UnifiedInputProps {
  mode: "text" | "file";
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange?: (value: string) => void;

  accept?: string;
  onFileSelect?: (file: File | null) => void;
  selectedFile?: File | null;

  models: ModelConfig[];
  defaultModelId: string;
  storageKey: string;
  onModelChange: (modelId: string) => void;

  actionLabel: string;
  actionIcon?: React.ReactNode;
  onAction: () => void;

  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;

  showCharCount?: boolean;
  showKeyboardHints?: boolean;
  helperText?: string;

  submitOnEnter?: boolean;
}

export default function UnifiedInput({
  mode,
  placeholder = "Enter your input...",
  rows = 3,
  value = "",
  onChange,

  accept,
  onFileSelect,
  selectedFile,

  models,
  defaultModelId,
  storageKey,
  onModelChange,

  actionLabel,
  actionIcon,
  onAction,

  disabled = false,
  loading = false,
  loadingLabel = "Processing...",

  showCharCount = false,
  showKeyboardHints = false,
  helperText,

  submitOnEnter = false,
}: UnifiedInputProps) {
  const [message, setMessage] = useState(value);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    onChange?.(e.target.value);
  };

  const handleModelChange = (modelId: string) => {
    onModelChange(modelId);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && submitOnEnter) {
      e.preventDefault();
      if (!disabled && !loading && message.trim()) {
        onAction();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && accept && file.type.startsWith(accept)) {
      onFileSelect?.(file);
    } else if (file && !accept) {
      onFileSelect?.(file);
    }
  };

  const handleFileClick = () => {
    if (!disabled) {
      onFileSelect?.(null);
    }
  };

  const handleAction = () => {
    if (mode === "text" && submitOnEnter) {
      if (message.trim() && !disabled && !loading) {
        onAction();
      }
    } else {
      onAction();
    }
  };

  return (
    <div className="unified-input">
      <div className="unified-input-header">
        <ModelSelector
          models={models}
          defaultModelId={defaultModelId}
          storageKey={storageKey}
          onModelChange={handleModelChange}
          disabled={disabled}
          variant="compact"
        />
      </div>

      <div className="unified-input-body">
        {mode === "text" ? (
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className="unified-input-body textarea-base"
          />
        ) : (
          <div
            className={`unified-input-file-dropzone ${selectedFile ? "has-file" : ""}`}
            onClick={handleFileClick}
          >
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              disabled={disabled}
              className="hidden"
            />
            {selectedFile ? (
              <div className="unified-input-file-info">
                <Upload size={20} />
                <span>{selectedFile.name}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload size={32} style={{ color: "var(--theme-accent)" }} />
                <span style={{ color: "var(--theme-text-primary)" }}>
                  {placeholder}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="unified-input-footer">
        <div className="unified-input-hints">
          {showKeyboardHints && mode === "text" && (
            <span>
              Press <kbd>Enter</kbd> to {submitOnEnter ? "send" : "new line"},{" "}
              <kbd>Shift + Enter</kbd> for new line
            </span>
          )}
          {showCharCount && mode === "text" && (
            <span>
              {message.length} character{message.length !== 1 ? "s" : ""}
            </span>
          )}
          {helperText && <span>{helperText}</span>}
        </div>

        <Button
          variant="primary"
          onClick={handleAction}
          disabled={disabled || loading || (mode === "text" && !message.trim())}
          loading={loading}
          icon={loading ? undefined : actionIcon}
        >
          {loading ? loadingLabel : actionLabel}
        </Button>
      </div>
    </div>
  );
}

function ModelSelector({
  models,
  defaultModelId,
  storageKey,
  onModelChange,
  disabled = false,
  variant = "stacked",
}: {
  models: ModelConfig[];
  defaultModelId: string;
  storageKey: string;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
  variant?: "stacked" | "inline" | "compact";
}) {
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(storageKey) || defaultModelId;
    }
    return defaultModelId;
  });

  useEffect(() => {
    onModelChange(selectedModel);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, selectedModel);
    }
  }, [selectedModel, onModelChange, storageKey]);

  const currentModel = models.find((m) => m.id === selectedModel);
  const isInline = variant === "inline";
  const isCompact = variant === "compact";
  const containerClassName = isInline
    ? `min-w-[220px]`
    : isCompact
      ? ``
      : `w-full max-w-4xl mx-auto px-6 py-5 animate-slide-up`;
  const cardClassName = isInline
    ? "rounded-2xl px-4 py-3 border flex items-center gap-3"
    : isCompact
      ? "rounded-xl px-3 py-2 border flex items-center gap-2"
      : "rounded-2xl p-5 border";

  return (
    <div className={containerClassName}>
      <div
        className={cardClassName}
        style={{
          backgroundColor: "var(--theme-bg-elevated)",
          borderColor: "var(--theme-border)",
          boxShadow: "var(--theme-shadow-sm)",
        }}
      >
        <div
          className={
            isInline
              ? "relative flex-1"
              : isCompact
                ? "relative flex-1"
                : "relative"
          }
>
            <Select
              value={selectedModel}
              onValueChange={(val) => setSelectedModel(val as string)}
              disabled={disabled}
              hideLabel
            >
              {models.map((model) => (
                <Select.Option key={model.id} value={model.id}>
                  {model.name}
                  {model.description ? ` - ${model.description}` : ""}
                </Select.Option>
              ))}
            </Select>
          </div>

        {currentModel && !isInline && !isCompact && (
          <div className="flex items-center gap-2 mt-3">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor:
                  currentModel.provider === "openai"
                    ? "var(--theme-accent-subtle)"
                    : "var(--theme-surface-hover)",
                color:
                  currentModel.provider === "openai"
                    ? "var(--theme-accent-dark)"
                    : "var(--theme-text-secondary)",
              }}
            >
              {currentModel.provider === "openai" ? "OpenAI" : "Workers AI"}
            </span>
            {currentModel.description && (
              <span
                className="text-xs"
                style={{ color: "var(--theme-text-subtle)" }}
              >
                {currentModel.description}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
