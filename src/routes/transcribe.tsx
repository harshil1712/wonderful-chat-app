import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import UnifiedInput from "@/components/UnifiedInput";
import { getModelsForCapability, getDefaultModelId } from "@/config/models";
import { Label, Surface } from "@cloudflare/kumo";

export const Route = createFileRoute("/transcribe")({
  component: TranscribePage,
});

function TranscribePage() {
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("selected-transcribe-model") ||
        getDefaultModelId("transcribe")
      );
    }
    return getDefaultModelId("transcribe");
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranscribe = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    setTranscription(null);

    try {
      const formData = new FormData();
      formData.append("audio", selectedFile);
      formData.append("model", selectedModel);

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to transcribe audio");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setTranscription(data.text);
    } catch (err: any) {
      console.error("Transcription error:", err);
      setError(err.message || "An error occurred during transcription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-root">
      <div className="page-main">
        <div className="page-container">
          <div className="page-header">
            <h1 className="page-title">TRANSCRIPTION.</h1>
            <p className="page-subtitle">AUDIO TO TEXT CONVERSION.</p>
          </div>

          <Surface className="card-surface mb-8 border border-black rounded-none">
            <Label htmlFor="audio-file-input" className="field-label">AUDIO FILE INPUT</Label>
            <UnifiedInput
              mode="file"
              inputId="audio-file-input"
              accept="audio/*"
              placeholder="DRAG AUDIO OR CLICK TO UPLOAD"
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
              models={getModelsForCapability("transcribe")}
              defaultModelId={getDefaultModelId("transcribe")}
              storageKey="selected-transcribe-model"
              onModelChange={setSelectedModel}
              actionLabel="TRANSCRIBE"
              onAction={handleTranscribe}
              disabled={isLoading || !selectedFile}
              loading={isLoading}
              loadingLabel="PROCESSING AUDIO..."
              helperText="SUPPORTED FORMATS: MP3, WAV, M4A, OGG"
            />
          </Surface>

          {error && (
            <Surface className="error-card animate-scale-in mb-8 bg-black text-white rounded-none border-none">
              <strong>ERROR:</strong> {error}
            </Surface>
          )}

          {transcription && (
            <Surface className="result-card animate-slide-up border border-black rounded-none">
              <h2 className="result-title">TRANSCRIPT OUTPUT</h2>
              <div 
                className="whitespace-pre-wrap text-lg font-ui" 
                style={{ lineHeight: '1.6' }}
              >
                {transcription}
              </div>
            </Surface>
          )}
        </div>
      </div>
    </div>
  );
}
