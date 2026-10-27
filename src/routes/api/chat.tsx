import { chat, toServerSentEventsResponse } from "@tanstack/ai";
import {
  createOpenAiChat,
  createWorkersAiChat,
  createGeminiChat,
} from "@cloudflare/tanstack-ai";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { getModelById } from "@/config/models";
import { requireSession } from "../../../lib/auth.functions";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Check authentication
        try {
          await requireSession();
        } catch {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const body = (await request.json()) as any;
        const { messages, data } = body;
        const modelId = data?.model;
        const conversationId = data?.conversationId;

        // Validate model
        const modelConfig = getModelById("chat", modelId);
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
        } else if (modelConfig.provider === "google") {
          adapter = createGeminiChat(modelConfig.id as any, {
            binding: env.AI.gateway("openclaw-pi-demo"),
          });
        } else {
          // Workers AI
          adapter = createWorkersAiChat(modelConfig.id as any, {
            binding: env.AI,
          });
        }

        try {
          console.log("[api.chat] Starting chat request", {
            model: modelConfig.id,
            provider: modelConfig.provider,
            conversationId,
            messageCount: messages.length,
            lastMessage: messages[messages.length - 1]?.role,
          });

          // Create a streaming chat response
          const stream = chat({
            adapter,
            messages,
            conversationId,
            stream: true,
            maxTokens: 131000,
          });

          console.log("[api.chat] Chat stream created successfully");

          // Convert stream to HTTP response
          return toServerSentEventsResponse(stream);
        } catch (error) {
          console.error("[api.chat] Error during chat request:", error);
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
