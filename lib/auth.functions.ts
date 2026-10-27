import { getRequest, getRequestHeaders } from "@tanstack/react-start/server";
import { createAuth } from "./auth";
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { auth } from "./auth";

export const getSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders();
    // const auth = createAuth(env.DB);
    const session = await auth.api.getSession({ headers });

    return session;
  },
);

export const requireSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest();
    // const auth = createAuth(env.DB);
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      throw new Error("Unauthorized");
    }

    return { session };
  },
);
