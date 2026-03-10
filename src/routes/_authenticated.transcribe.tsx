import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import UnifiedInput from "@/components/UnifiedInput";
import { getModelsForCapability, getDefaultModelId } from "@/config/models";
import { Label, Surface } from "@cloudflare/kumo";

export const Route = createFileRoute("/_authenticated/transcribe")({
  component: TranscribePage,
});

function TranscribePage() {
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("selected-transcribe-model") ||
        getDefaultModelId("transcription")
      );
    }
    return getDefaultModelId("transcription");
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
      const arrayBuffer = await selectedFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Audio = btoa(binary);

      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio: base64Audio,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error: string };
        throw new Error(errorData.error || "Failed to transcribe audio");
      }

      const data = (await response.json()) as { text: string; language: string; duration: number };
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
              models={getModelsForCapability("transcription")}
              defaultModelId={getDefaultModelId("transcription")}
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
