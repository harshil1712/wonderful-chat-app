import { env } from "cloudflare:workers";
import { createAuth } from "../../../lib/auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const auth = createAuth(env.DB);
        return await auth.handler(request);
      },
      POST: async ({ request }: { request: Request }) => {
        const auth = createAuth(env.DB);
        return await auth.handler(request);
      },
    },
  },
});
