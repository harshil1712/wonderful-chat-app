import { chat, toHttpResponse, toServerSentEventsResponse } from "@tanstack/ai";
import { createOpenAiChat, createWorkersAiChat } from "@cloudflare/tanstack-ai";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // const adapter = createWorkersAiChat(
        //   // "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
        //   // "@cf/ibm-granite/granite-4.0-h-micro",
        //   "@cf/openai/gpt-oss-20b",
        //   {
        //     binding: env.AI,
        //   },
        // );

        // const adapter = createOpenAiChat("gpt-4o", {
        //   binding: env.AI.gateway("openclaw-pi-demo"),
        //   cfApiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        // });

        const adapter = createWorkersAiChat("@cf/openai/gpt-oss-20b", {
          binding: env.AI,
          gatewayId: "openclaw-pi-demo",
        });

        const { messages, conversationId } = await request.json();

        try {
          // Create a streaming chat response
          const stream = chat({
            adapter,
            messages,
            conversationId,
            stream: true,
            maxTokens: 131000,
          });

          // return toHttpResponse(stream);

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
