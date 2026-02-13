import { chat, toServerSentEventsResponse } from "@tanstack/ai";
import { createOpenAiChat, createWorkersAiChat } from "@cloudflare/tanstack-ai";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { getModelById } from "@/config/models";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as any;
        const { messages, data } = body;
        const modelId = data?.model;
        const conversationId = data?.conversationId;

        // Validate model
        const modelConfig = getModelById(modelId);
        if (!modelConfig) {
          return new Response(
            JSON.stringify({
              error: `Invalid model: ${modelId}`,
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }

        // Create adapter based on provider
        let adapter;
        if (modelConfig.provider === "openai") {
          adapter = createOpenAiChat(modelConfig.id as any, {
            binding: env.AI.gateway("openclaw-pi-demo"),
          });
        } else {
          // Workers AI
          adapter = createWorkersAiChat(modelConfig.id as any, {
            binding: env.AI,
            gatewayId: "unified-billling-test",
          });
        }

        try {
          // Create a streaming chat response
          const stream = chat({
            adapter,
            messages,
            conversationId,
            stream: true,
            maxTokens: 131000,
          });

          // Convert stream to HTTP response
          return toServerSentEventsResponse(stream);
        } catch (error) {
          return new Response(
            JSON.stringify({
              error:
                error instanceof Error ? error.message : "An error occurred",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});
