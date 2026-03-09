import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import UnifiedInput from "@/components/UnifiedInput";
import { Surface } from "@cloudflare/kumo";
import { getModelsForCapability, getDefaultModelId } from "@/config/models";
import { Volume2 } from "lucide-react";

export const Route = createFileRoute("/tts")({ component: TTSPage });

function TTSPage() {
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("selected-tts-model") || getDefaultModelId("tts")
      );
    }
    return getDefaultModelId("tts");
  });

  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audio, setAudio] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    setError(null);
    setAudio(null);

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, model: selectedModel }),
      });

      if (!response.ok) {
        throw new Error("Speech generation failed");
      }

      const data = (await response.json()) as { audio: string };
      setAudio(data.audio);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="page-root">
      <div className="page-main">
        <div className="page-container">
          {error && <div className="error-card mb-6">{error}</div>}

          {!audio && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Volume2 size={48} strokeWidth={1.5} />
              </div>
              <h2 className="empty-state-title">Give your words a voice</h2>
              <p className="empty-state-subtitle">
                Enter text and hear it spoken aloud with natural-sounding AI voices.
              </p>
            </div>
          )}

          {audio && (
            <Surface className="result-card">
              <h3 className="result-title">Generated Audio</h3>
              <audio controls src={audio} className="w-full" />
            </Surface>
          )}
        </div>
      </div>

      <div className="page-footer">
        <div className="page-footer-inner">
          <UnifiedInput
            mode="text"
            placeholder="Enter the text you want to convert to speech..."
            rows={4}
            value={text}
            onChange={setText}
            models={getModelsForCapability("tts")}
            defaultModelId={getDefaultModelId("tts")}
            storageKey="selected-tts-model"
            onModelChange={setSelectedModel}
            actionLabel="Generate Speech"
            actionIcon={<Volume2 size={18} />}
            onAction={handleGenerate}
            disabled={isGenerating}
            loading={isGenerating}
            loadingLabel="Generating..."
          />
        </div>
      </div>
    </div>
  );
}
