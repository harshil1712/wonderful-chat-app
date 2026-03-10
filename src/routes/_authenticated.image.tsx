import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import UnifiedInput from "@/components/UnifiedInput";
import { getModelsForCapability, getDefaultModelId } from "@/config/models";
import { Label, Surface } from "@cloudflare/kumo";

export const Route = createFileRoute("/_authenticated/image")({ component: ImagePage });

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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error: string };
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = (await response.json()) as { image: string; model: string };
      setImageUrl(data.image);
    } catch (err: any) {
      console.error("Image generation error:", err);
      setError(err.message || "An error occurred while generating the image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-root">
      <div className="page-main">
        <div className="page-container">
          <div className="page-header">
            <h1 className="page-title">IMAGE GENERATION.</h1>
            <p className="page-subtitle">SYNTHESIZE VISUALS FROM TEXT.</p>
          </div>

          <Surface className="card-surface mb-8 border border-black rounded-none">
            <Label htmlFor="prompt-input" className="field-label">
              IMAGE PROMPT
            </Label>
            <UnifiedInput
              mode="text"
              inputId="prompt-input"
              placeholder="DESCRIBE THE IMAGE..."
              rows={3}
              value={prompt}
              onChange={setPrompt}
              models={getModelsForCapability("image")}
              defaultModelId={getDefaultModelId("image")}
              storageKey="selected-image-model"
              onModelChange={setSelectedModel}
              actionLabel="GENERATE"
              onAction={handleGenerate}
              disabled={isLoading}
              loading={isLoading}
              loadingLabel="SYNTHESIZING..."
            />
          </Surface>

          {error && (
            <Surface className="error-card animate-scale-in mb-8 bg-black text-white rounded-none border-none">
              <strong>ERROR:</strong> {error}
            </Surface>
          )}

          {imageUrl && (
            <Surface className="result-card animate-slide-up flex justify-center border border-black rounded-none shadow-[8px_8px_0_0_#000]">
              <img
                src={imageUrl}
                alt={prompt}
                className="max-w-full h-auto"
              />
            </Surface>
          )}
        </div>
      </div>
    </div>
  );
}
