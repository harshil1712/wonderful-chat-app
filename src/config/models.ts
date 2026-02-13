export type ModelProvider = "workers-ai" | "openai";

export interface ModelConfig {
  id: string;
  name: string;
  provider: ModelProvider;
  description?: string;
}

export const MODELS: ModelConfig[] = [
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
    id: "@cf/ibm-granite/granite-4.0-h-micro",
    name: "Granite 4.0 Micro",
    provider: "workers-ai",
    description: "IBM's compact model",
  },
  {
    id: "@cf/openai/gpt-oss-20b",
    name: "GPT OSS 20B",
    provider: "workers-ai",
    description: "Open-source GPT model",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "OpenAI's latest model",
  },
];

export const DEFAULT_MODEL_ID = "@cf/zai-org/glm-4.7-flash";

export function getModelById(id: string): ModelConfig | undefined {
  return MODELS.find((model) => model.id === id);
}
