import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import UnifiedInput from "@/components/UnifiedInput";
import { Surface } from "@cloudflare/kumo";
import { getModelsForCapability, getDefaultModelId } from "@/config/models";
import { Mic } from "lucide-react";

export const Route = createFileRoute("/transcribe")({
  component: TranscribePage,
});

function TranscribePage() {
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("selected-transcription-model") ||
        getDefaultModelId("transcription")
      );
    }
    return getDefaultModelId("transcription");
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<{
    text: string;
    language?: string;
    duration?: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTranscribe = async () => {
    if (!audioFile) return;

    setIsTranscribing(true);
    setError(null);
    setTranscription(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const base64Data = base64.split(",")[1];

        const response = await fetch("/api/transcribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audio: base64Data,
            model: selectedModel,
          }),
        });

        if (!response.ok) {
          throw new Error("Transcription failed");
        }

        const data = (await response.json()) as {
          text: string;
          language?: string;
          duration?: number;
        };
        setTranscription(data);
        setIsTranscribing(false);
      };

      reader.onerror = () => {
        setError("Failed to read audio file");
        setIsTranscribing(false);
      };

      reader.readAsDataURL(audioFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsTranscribing(false);
    }
  };

  return (
    <div className="page-root">
      <div className="page-main">
        <div className="page-container">
          {error && <div className="error-card mb-6">{error}</div>}

          {!transcription && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Mic size={48} strokeWidth={1.5} />
              </div>
              <h2 className="empty-state-title">Transform speech to text</h2>
              <p className="empty-state-subtitle">
                Upload an audio file and let AI convert spoken words into written text.
              </p>
            </div>
          )}

          {transcription && (
            <Surface className="result-card">
              <h3 className="result-title">Transcription Result</h3>
              <div
                className="rounded-lg p-4 border mb-4"
                style={{
                  backgroundColor: "var(--theme-surface)",
                  borderColor: "var(--theme-border)",
                }}
              >
                <p className="whitespace-pre-wrap" style={{ lineHeight: 1.7 }}>
                  {transcription.text}
                </p>
              </div>
              {(transcription.language || transcription.duration) && (
                <div
                  className="flex gap-4 text-sm"
                  style={{ color: "var(--theme-text-subtle)" }}
                >
                  {transcription.language && (
                    <span>Language: {transcription.language}</span>
                  )}
                  {transcription.duration && (
                    <span>Duration: {transcription.duration.toFixed(1)}s</span>
                  )}
                </div>
              )}
            </Surface>
          )}
        </div>
      </div>

      <div className="page-footer">
        <div className="page-footer-inner">
          <UnifiedInput
            mode="file"
            accept="audio/*"
            selectedFile={audioFile}
            onFileSelect={setAudioFile}
            models={getModelsForCapability("transcription")}
            defaultModelId={getDefaultModelId("transcription")}
            storageKey="selected-transcription-model"
            onModelChange={setSelectedModel}
            actionLabel="Transcribe"
            actionIcon={<Mic size={18} />}
            onAction={handleTranscribe}
            disabled={isTranscribing}
            loading={isTranscribing}
            loadingLabel="Transcribing..."
          />
        </div>
      </div>
    </div>
  );
}
