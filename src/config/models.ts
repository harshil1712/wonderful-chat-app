export type ModelProvider = "workers-ai" | "openai" | "google";
export type Capability =
  | "chat"
  | "image"
  | "transcription"
  | "tts"
  | "summarization";

export interface ModelConfig {
  id: string;
  name: string;
  provider: ModelProvider;
  description?: string;
}

export interface CapabilityConfig {
  models: ModelConfig[];
  defaultId: string;
}

export const MODELS: Record<Capability, CapabilityConfig> = {
  chat: {
    models: [
      {
        id: "@cf/zai-org/glm-4.7-flash",
        name: "GLM 4.7 Flash",
        provider: "workers-ai",
        description: "Fast and efficient model",
      },
      {
        id: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
        name: "Llama 3.3 70B",
        provider: "workers-ai",
        description: "Powerful open-source model",
      },
      {
        id: "gpt-4o",
        name: "GPT-4o",
        provider: "openai",
        description: "OpenAI's flagship model",
      },
      {
        id: "gpt-5.2",
        name: "GPT-5.2",
        provider: "openai",
        description: "OpenAI's latest model",
      },
      {
        id: "@cf/meta/llama-3.1-8b-instruct-fp8",
        name: "Llama 3.1 8B",
        provider: "workers-ai",
        description: "Fast and compact model",
      },
      {
        id: "@cf/qwen/qwen2.5-coder-32b-instruct",
        name: "Qwen 2.5 Coder 32B",
        provider: "workers-ai",
        description: "Great for technical tasks",
      },
      {
        id: "gemini-3.1-pro",
        name: "Gemini 3.1 Pro",
        provider: "google",
        description: "Google's advanced multimodal model",
      },
    ],
    defaultId: "@cf/zai-org/glm-4.7-flash",
  },
  image: {
    models: [
      {
        id: "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        name: "Stable Diffusion XL",
        provider: "workers-ai",
        description: "High-quality image generation",
      },
      {
        id: "@cf/bytedance/stable-diffusion-xl-lightning",
        name: "SD XL Lightning",
        provider: "workers-ai",
        description: "Faster variant of SDXL",
      },
      {
        id: "@cf/black-forest-labs/flux-1-schnell",
        name: "Flux Schnell",
        provider: "workers-ai",
        description: "Fast, high-quality results",
      },
    ],
    defaultId: "@cf/stabilityai/stable-diffusion-xl-base-1.0",
  },
  transcription: {
    models: [
      {
        id: "@cf/openai/whisper-large-v3-turbo",
        name: "Whisper v3 Turbo",
        provider: "workers-ai",
        description: "Fast and accurate transcription",
      },
      {
        id: "@cf/openai/whisper",
        name: "Whisper",
        provider: "workers-ai",
        description: "Standard Whisper model",
      },
      {
        id: "@cf/openai/whisper-tiny-en",
        name: "Whisper Tiny (English)",
        provider: "workers-ai",
        description: "Lightweight English-only model",
      },
      {
        id: "@cf/deepgram/nova-3",
        name: "Deepgram Nova 3",
        provider: "workers-ai",
        description: "Latest Deepgram model",
      },
    ],
    defaultId: "@cf/openai/whisper-large-v3-turbo",
  },
  tts: {
    models: [
      {
        id: "@cf/deepgram/aura-2-en",
        name: "Deepgram Aura 2",
        provider: "workers-ai",
        description: "Natural-sounding English speech",
      },
    ],
    defaultId: "@cf/deepgram/aura-2-en",
  },
  summarization: {
    models: [
      {
        id: "@cf/facebook/bart-large-cnn",
        name: "BART Large CNN",
        provider: "workers-ai",
        description: "Effective text summarization",
      },
    ],
    defaultId: "@cf/facebook/bart-large-cnn",
  },
};

// Helper functions
export function getModelsForCapability(capability: Capability): ModelConfig[] {
  return MODELS[capability].models;
}

export function getDefaultModelId(capability: Capability): string {
  return MODELS[capability].defaultId;
}

export function getModelById(
  capability: Capability,
  modelId: string,
): ModelConfig | undefined {
  return MODELS[capability].models.find((model) => model.id === modelId);
}

// For backwards compatibility with chat page
export const DEFAULT_MODEL_ID = MODELS.chat.defaultId;
