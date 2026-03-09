import { createFileRoute } from "@tanstack/react-router";
import { createWorkersAiTranscription } from "@cloudflare/tanstack-ai/adapters/workers-ai-transcription";
import { generateTranscription } from "@tanstack/ai";
import { env } from "cloudflare:workers";

export const Route = createFileRoute("/api/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            audio: string;
            model: string;
            language?: string;
          };
          const { audio, model, language } = body;

          console.log("[api.transcribe] Starting transcription", {
            model,
            audioSize: `${(audio?.length || 0 / 1024).toFixed(2)} KB`,
            language,
          });

          const adapter = createWorkersAiTranscription(model as any, {
            binding: env.AI,
          });

          // Convert base64 to ArrayBuffer
          const binaryString = atob(audio);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const audioBuffer = bytes.buffer;

          const startTime = Date.now();
          const result = await generateTranscription({
            adapter,
            audio: audioBuffer,
            language,
          });

          const duration = Date.now() - startTime;

          console.log("[api.transcribe] Transcription completed", {
            duration: `${duration}ms`,
            textLength: result.text?.length || 0,
            language: result.language,
          });

          return new Response(
            JSON.stringify({
              text: result.text,
              language: result.language,
              duration: result.duration,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error) {
          console.error("[api.transcribe] Error during transcription:", error);
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
