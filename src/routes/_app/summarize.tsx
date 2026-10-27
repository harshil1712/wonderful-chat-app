import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import UnifiedInput from "@/components/UnifiedInput";
import { getModelsForCapability, getDefaultModelId } from "@/config/models";
import { Label, Surface } from "@cloudflare/kumo";

export const Route = createFileRoute("/_app/summarize")({
  component: SummarizePage,
});

function SummarizePage() {
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("selected-summarize-model") ||
        getDefaultModelId("summarization")
      );
    }
    return getDefaultModelId("summarization");
  });

  const [inputUrl, setInputUrl] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!inputUrl.trim()) return;

    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: inputUrl,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error: string };
        throw new Error(errorData.error || "Failed to summarize URL");
      }

      const data = (await response.json()) as { summary: string; model: string };
      setSummary(data.summary);
    } catch (err: any) {
      console.error("Summarization error:", err);
      setError(err.message || "An error occurred during summarization.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-root">
      <div className="page-main">
        <div className="page-container">
          <div className="page-header">
            <h1 className="page-title">SUMMARIZATION.</h1>
            <p className="page-subtitle">EXTRACT CORE MEANING FROM URLS.</p>
          </div>

          <Surface className="card-surface mb-8 border border-black rounded-none">
            <Label htmlFor="url-input" className="field-label">
              URL TO SUMMARIZE
            </Label>
            <UnifiedInput
              mode="text"
              inputId="url-input"
              placeholder="HTTPS://..."
              rows={1}
              value={inputUrl}
              onChange={setInputUrl}
              models={getModelsForCapability("summarization")}
              defaultModelId={getDefaultModelId("summarization")}
              storageKey="selected-summarize-model"
              onModelChange={setSelectedModel}
              actionLabel="EXTRACT"
              onAction={handleSummarize}
              disabled={isLoading}
              loading={isLoading}
              loadingLabel="EXTRACTING..."
              submitOnEnter
            />
          </Surface>

          {error && (
            <Surface className="error-card animate-scale-in mb-8 bg-black text-white rounded-none border-none">
              <strong>ERROR:</strong> {error}
            </Surface>
          )}

          {summary && (
            <Surface className="result-card animate-slide-up border border-black rounded-none">
              <h2 className="result-title">SUMMARY RESULT</h2>
              <div 
                className="whitespace-pre-wrap text-lg font-ui" 
                style={{ lineHeight: '1.6' }}
              >
                {summary}
              </div>
            </Surface>
          )}
        </div>
      </div>
    </div>
  );
}
