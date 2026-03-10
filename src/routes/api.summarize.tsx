import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { getModelById } from "@/config/models";

export const Route = createFileRoute("/api/summarize")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            url: string;
            model: string;
          };
          const { url, model } = body;

          if (!url) {
            return new Response(
              JSON.stringify({
                error: "URL is required",
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          console.log("[api.summarize] Starting summarization", {
            url: url?.substring(0, 100),
            model,
          });

          // Validate model
          const modelConfig = getModelById("summarization", model);
          if (!modelConfig) {
            return new Response(
              JSON.stringify({
                error: `Invalid model: ${model}`,
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          // Fetch the URL content
          const startTime = Date.now();
          const pageResponse = await fetch(url, {
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; SummarizeBot/1.0)",
            },
          });

          if (!pageResponse.ok) {
            return new Response(
              JSON.stringify({
                error: `Failed to fetch URL: ${pageResponse.statusText}`,
              }),
              {
                status: 502,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          const html = await pageResponse.text();

          // Extract text content from HTML (simple approach)
          const textContent = extractTextFromHtml(html);
          if (!textContent.trim()) {
            return new Response(
              JSON.stringify({
                error: "Could not extract readable content from URL",
              }),
              {
                status: 422,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          // Truncate to reasonable length for summarization model
          const truncatedText = textContent.slice(0, 3000);

          // Run summarization via Workers AI
          const aiResult = await env.AI.run(model as any, {
            input_text: truncatedText,
          });

          const duration = Date.now() - startTime;
          console.log("[api.summarize] Summarization completed", {
            duration: `${duration}ms`,
            model,
            originalLength: textContent.length,
            truncatedLength: truncatedText.length,
          });

          // Extract summary from response
          const summary =
            typeof aiResult === "string"
              ? aiResult
              : (aiResult as any).summary || "No summary generated";

          return new Response(
            JSON.stringify({
              summary,
              model,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (error) {
          console.error("[api.summarize] Error during summarization:", error);
          return new Response(
            JSON.stringify({
              error:
                error instanceof Error ? error.message : "An error occurred",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },
    },
  },
});

function extractTextFromHtml(html: string): string {
  // Remove script and style tags
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");

  // Extract content from common content tags
  const contentSelectors = [
    /<article[^>]*>([\s\S]*?)<\/article>/gi,
    /<main[^>]*>([\s\S]*?)<\/main>/gi,
    /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
    /<div[^>]*id="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
    /<p[^>]*>([\s\S]*?)<\/p>/gi,
  ];

  for (const selector of contentSelectors) {
    const matches: string[] = [];
    let match;
    while ((match = selector.exec(text)) !== null) {
      matches.push(match[1]);
    }
    if (matches.length > 0) {
      text = matches.join(" ");
      break;
    }
  }

  // Remove remaining HTML tags
  text = text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  return text;
}
