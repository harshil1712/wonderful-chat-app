import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import UnifiedInput from "@/components/UnifiedInput";
import { Surface } from "@cloudflare/kumo";
import { getModelsForCapability, getDefaultModelId } from "@/config/models";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/image")({ component: ImagePage });

function ImagePage() {
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("selected-image-model") ||
        getDefaultModelId("image")
      );
    }
    return getDefaultModelId("image");
  });

  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: selectedModel }),
      });

      if (!response.ok) {
        throw new Error("Image generation failed");
      }

      const data = (await response.json()) as { image: string };
      setGeneratedImage(data.image);
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

          {!generatedImage && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Sparkles size={48} strokeWidth={1.5} />
              </div>
              <h2 className="empty-state-title">Create stunning visuals</h2>
              <p className="empty-state-subtitle">
                Describe the image you want to generate and watch AI bring your ideas to life.
              </p>
            </div>
          )}

          {generatedImage && (
            <Surface className="result-card">
              <h3 className="result-title">Generated Image</h3>
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full rounded-lg border"
                style={{ borderColor: "var(--theme-border)" }}
              />
            </Surface>
          )}
        </div>
      </div>

      <div className="page-footer">
        <div className="page-footer-inner">
          <UnifiedInput
            mode="text"
            placeholder="Describe the image you want to generate..."
            rows={3}
            value={prompt}
            onChange={setPrompt}
            models={getModelsForCapability("image")}
            defaultModelId={getDefaultModelId("image")}
            storageKey="selected-image-model"
            onModelChange={setSelectedModel}
            actionLabel="Generate"
            actionIcon={<Sparkles size={18} />}
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
