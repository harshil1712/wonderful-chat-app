import { useEffect, useState } from "react";
import { Badge, Text } from "@cloudflare/kumo";
import { MODELS, DEFAULT_MODEL_ID } from "@/config/models";

const STORAGE_KEY = "selected-model";

interface ModelSelectorProps {
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
}

export default function ModelSelector({
  onModelChange,
  disabled = false,
}: ModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    // Initialize from localStorage or default
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_MODEL_ID;
    }
    return DEFAULT_MODEL_ID;
  });

  // Notify parent and persist to localStorage when selection changes
  useEffect(() => {
    onModelChange(selectedModel);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, selectedModel);
    }
  }, [selectedModel, onModelChange]);

  const currentModel = MODELS.find((m) => m.id === selectedModel);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4">
      <div className="flex flex-col gap-2">
        <div className="text-kumo-subtle text-sm font-medium">
          Model
        </div>
        <div className="relative">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={disabled}
            className="w-full bg-kumo-control text-kumo-default rounded-lg px-4 py-3 pr-10 border border-kumo-line focus:outline-none focus:ring-2 focus:ring-kumo-ring disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
          >
            {MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
                {model.description ? ` - ${model.description}` : ""}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-kumo-subtle"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {currentModel && (
          <div className="flex items-center gap-2">
            <Badge
              variant={currentModel.provider === "openai" ? "primary" : "secondary"}
            >
              {currentModel.provider === "openai" ? "OpenAI" : "Workers AI"}
            </Badge>
            {currentModel.description && (
              <Text variant="secondary">
                {currentModel.description}
              </Text>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
