import { useState, useRef, KeyboardEvent, useEffect } from "react";
import type { ModelConfig } from "@/config/models";
import { Upload } from "lucide-react";
import { Button, Input, Select, Textarea } from "@cloudflare/kumo";

interface UnifiedInputProps {
  mode: "text" | "file";
  placeholder?: string;
  rows?: number;
  inputId?: string;
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
  placeholder = "ENTER INPUT...",
  rows = 1,
  inputId,
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
  loadingLabel = "PROCESSING...",

  showCharCount = false,
  showKeyboardHints = false,
  helperText,

  submitOnEnter = false,
}: UnifiedInputProps) {
  const [message, setMessage] = useState(value);

  useEffect(() => {
    setMessage(value);
  }, [value]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInput = (nextValue: string) => {
    setMessage(nextValue);
    onChange?.(nextValue);
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
      fileInputRef.current?.click();
    }
  };

  const handleAction = () => {
    if (mode === "text") {
      if (message.trim() && !disabled && !loading) {
        onAction();
      }
    } else {
      onAction();
    }
  };

  return (
    <div className="unified-input">
      <div className="unified-input-content">
        {mode === "text" ? (
          <Textarea
            ref={textareaRef}
            id={inputId}
            value={message}
            onValueChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className="unified-input-textarea"
            style={{ minHeight: rows === 1 ? "48px" : "72px" }}
          />
        ) : (
          <>
            <Input
              ref={fileInputRef}
              id={inputId}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              disabled={disabled}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
            />
            <div
              className={`unified-input-file-dropzone ${selectedFile ? "has-file" : ""}`}
              onClick={handleFileClick}
              role="button"
              tabIndex={disabled ? -1 : 0}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !disabled) {
                  e.preventDefault();
                  handleFileClick();
                }
              }}
            >
              {selectedFile ? (
                <div className="unified-input-file-info justify-center">
                  <Upload size={24} />
                  <span className="font-heading uppercase tracking-wider">
                    {selectedFile.name}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4">
                  <Upload size={48} strokeWidth={1} />
                  <span className="font-heading uppercase font-bold text-xl tracking-wider">
                    {placeholder}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="unified-input-bottom">
        <div className="unified-input-left">
          <div className="unified-input-model">
            <ModelSelector
              models={models}
              defaultModelId={defaultModelId}
              storageKey={storageKey}
              onModelChange={handleModelChange}
              disabled={disabled}
            />
          </div>
          <div className="unified-input-hints">
            {showKeyboardHints && mode === "text" && (
              <span>
                [ENTER] {submitOnEnter ? "SUBMIT" : "NEW LINE"} • [SHIFT+ENTER]{" "}
                {submitOnEnter ? "NEW LINE" : "SUBMIT"}
              </span>
            )}
            {showCharCount && mode === "text" && (
              <span>CHARS: {message.length}</span>
            )}
            {helperText && <span>{helperText}</span>}
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleAction}
          disabled={disabled || loading || (mode === "text" && !message.trim())}
          loading={loading}
          icon={loading ? undefined : actionIcon}
          className="rounded-none border-2 border-transparent bg-black hover:bg-white hover:text-black hover:border-black font-heading tracking-widest uppercase font-bold"
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
}: {
  models: ModelConfig[];
  defaultModelId: string;
  storageKey: string;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
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

  return (
    <div className="w-full md:w-auto md:min-w-80">
      <Select
        value={selectedModel}
        onValueChange={(val) => setSelectedModel(val as string)}
        disabled={disabled}
        hideLabel
        className="!rounded-none !border-none !bg-white !text-black"
      >
        {models.map((model) => (
          <Select.Option key={model.id} value={model.id}>
            {model.name}
            {model.description ? ` - ${model.description}` : ""}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
}
