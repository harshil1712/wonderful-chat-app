import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import UnifiedInput from "@/components/UnifiedInput";
import { getModelsForCapability, getDefaultModelId } from "@/config/models";
import { Label, Surface } from "@cloudflare/kumo";

export const Route = createFileRoute("/_app/tts")({ component: TTSPage });

function TTSPage() {
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("selected-tts-model") ||
        getDefaultModelId("tts")
      );
    }
    return getDefaultModelId("tts");
  });

  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error: string };
        throw new Error(errorData.error || "Failed to generate speech");
      }

      const data = (await response.json()) as { audio: string; format: string };
      setAudioUrl(data.audio);
    } catch (err: any) {
      console.error("Text-to-speech error:", err);
      setError(err.message || "An error occurred while generating speech.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-root">
      <div className="page-main">
        <div className="page-container">
          <div className="page-header">
            <h1 className="page-title">TEXT TO SPEECH.</h1>
            <p className="page-subtitle">SYNTHESIZE AUDIO FROM TEXT.</p>
          </div>

          <Surface className="card-surface mb-8 border border-black rounded-none">
            <Label htmlFor="tts-input" className="field-label">INPUT TEXT</Label>
            <UnifiedInput
              mode="text"
              inputId="tts-input"
              placeholder="ENTER TEXT TO SYNTHESIZE..."
              rows={4}
              value={text}
              onChange={setText}
              models={getModelsForCapability("tts")}
              defaultModelId={getDefaultModelId("tts")}
              storageKey="selected-tts-model"
              onModelChange={setSelectedModel}
              actionLabel="SYNTHESIZE AUDIO"
              onAction={handleGenerate}
              disabled={isLoading}
              loading={isLoading}
              loadingLabel="GENERATING..."
              showCharCount
            />
          </Surface>

          {error && (
            <Surface className="error-card animate-scale-in mb-8 bg-black text-white rounded-none border-none">
              <strong>ERROR:</strong> {error}
            </Surface>
          )}

          {audioUrl && (
            <Surface className="result-card animate-slide-up border border-black rounded-none">
              <h2 className="result-title">AUDIO OUTPUT</h2>
              <audio
                controls
                src={audioUrl}
                autoPlay
                className="w-full mt-4 border border-black shadow-[4px_4px_0_0_#000]"
                style={{ borderRadius: 0 }}
              />
            </Surface>
          )}
        </div>
      </div>
    </div>
  );
}
