import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import UnifiedInput from "@/components/UnifiedInput";
import { Surface } from "@cloudflare/kumo";
import { getModelsForCapability, getDefaultModelId } from "@/config/models";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/summarize")({
  component: SummarizePage,
});

function SummarizePage() {
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("selected-summarization-model") ||
        getDefaultModelId("summarization")
      );
    }
    return getDefaultModelId("summarization");
  });

  const [text, setText] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!text.trim()) return;

    setIsSummarizing(true);
    setError(null);
    setSummary(null);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, model: selectedModel }),
      });

      if (!response.ok) {
        throw new Error("Summarization failed");
      }

      const data = (await response.json()) as { summary: string };
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="page-root">
      <div className="page-main">
        <div className="page-container">
          {error && <div className="error-card mb-6">{error}</div>}

          {!summary && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FileText size={48} strokeWidth={1.5} />
              </div>
              <h2 className="empty-state-title">Distill the essentials</h2>
              <p className="empty-state-subtitle">
                Paste long text and get a concise summary that captures the key points.
              </p>
            </div>
          )}

          {summary && (
            <Surface className="result-card">
              <h3 className="result-title">Summary</h3>
              <div
                className="rounded-lg p-4 border mb-4"
                style={{
                  backgroundColor: "var(--theme-surface)",
                  borderColor: "var(--theme-border)",
                }}
              >
                <p className="whitespace-pre-wrap" style={{ lineHeight: 1.7 }}>
                  {summary}
                </p>
              </div>
              <div
                className="flex gap-4 text-sm"
                style={{ color: "var(--theme-text-subtle)" }}
              >
                <span>
                  Original: {text.length} characters ({text.split(/\s+/).length}{" "}
                  words)
                </span>
                <span>
                  Summary: {summary.length} characters (
                  {summary.split(/\s+/).length} words)
                </span>
              </div>
            </Surface>
          )}
        </div>
      </div>

      <div className="page-footer">
        <div className="page-footer-inner">
          <UnifiedInput
            mode="text"
            placeholder="Paste the text you want to summarize..."
            rows={6}
            value={text}
            onChange={setText}
            models={getModelsForCapability("summarization")}
            defaultModelId={getDefaultModelId("summarization")}
            storageKey="selected-summarization-model"
            onModelChange={setSelectedModel}
            actionLabel="Summarize"
            actionIcon={<FileText size={18} />}
            onAction={handleSummarize}
            disabled={isSummarizing}
            loading={isSummarizing}
            loadingLabel="Summarizing..."
            showCharCount
          />
        </div>
      </div>
    </div>
  );
}
