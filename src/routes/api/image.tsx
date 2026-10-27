import { createFileRoute } from "@tanstack/react-router";
import { createWorkersAiImage } from "@cloudflare/tanstack-ai/adapters/workers-ai-image";
import { generateImage } from "@tanstack/ai";
import { env } from "cloudflare:workers";
import { requireSession } from "../../../lib/auth.functions";

export const Route = createFileRoute("/api/image")({
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

        try {
          const body = (await request.json()) as {
            prompt: string;
            model: string;
          };
          const { prompt, model } = body;

          console.log("[api.image] Starting image generation", {
            prompt: prompt?.substring(0, 100),
            model,
          });

          const adapter = createWorkersAiImage(model as any, {
            binding: env.AI,
          });

          const startTime = Date.now();
          const result = await generateImage({
            adapter,
            prompt,
            numberOfImages: 1,
          });

          const duration = Date.now() - startTime;
          const imageData = result.images[0]?.b64Json
            ? `data:image/png;base64,${result.images[0].b64Json}`
            : "";

          console.log("[api.image] Image generation completed", {
            duration: `${duration}ms`,
            hasImage: !!imageData,
            model: result.model,
          });

          return new Response(
            JSON.stringify({
              image: imageData,
              model: result.model,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error) {
          console.error("[api.image] Error during image generation:", error);
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
