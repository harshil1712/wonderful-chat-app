import { createFileRoute } from "@tanstack/react-router";
import { createWorkersAiTts } from "@cloudflare/tanstack-ai/adapters/workers-ai-tts";
import { generateSpeech } from "@tanstack/ai";
import { env } from "cloudflare:workers";

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            text: string;
            model: string;
          };
          const { text, model } = body;

          console.log("[api.tts] Starting speech generation", {
            textLength: text?.length || 0,
            model,
          });

          const adapter = createWorkersAiTts(model as any, {
            binding: env.AI,
          });

          const startTime = Date.now();
          const result = await generateSpeech({
            adapter,
            text,
          });

          const duration = Date.now() - startTime;
          const audioData = result.audio.startsWith("data:")
            ? result.audio
            : `data:audio/mp3;base64,${result.audio}`;

          console.log("[api.tts] Speech generation completed", {
            duration: `${duration}ms`,
            format: result.format || "mp3",
          });

          return new Response(
            JSON.stringify({
              audio: audioData,
              format: result.format || "mp3",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error) {
          console.error("[api.tts] Error during speech generation:", error);
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
