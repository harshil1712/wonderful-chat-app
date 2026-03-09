import { useEffect, useState } from "react";
import type { ModelConfig } from "@/config/models";
import { Select } from "@cloudflare/kumo";

interface ModelSelectorProps {
  models: ModelConfig[];
  defaultModelId: string;
  storageKey: string;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
  variant?: "stacked" | "inline" | "compact";
  className?: string;
}

export default function ModelSelector({
  models,
  defaultModelId,
  storageKey,
  onModelChange,
  disabled = false,
  variant = "stacked",
  className = "",
}: ModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    // Initialize from localStorage or default
    if (typeof window !== "undefined") {
      return localStorage.getItem(storageKey) || defaultModelId;
    }
    return defaultModelId;
  });

  // Notify parent and persist to localStorage when selection changes
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
    ? `min-w-[220px] ${className}`
    : isCompact
      ? `${className}`
      : `w-full max-w-4xl mx-auto px-6 py-5 animate-slide-up ${className}`;
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
