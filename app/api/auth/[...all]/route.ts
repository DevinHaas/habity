import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { type NextRequest } from "next/server";

const handler = toNextJsHandler(auth);

function withLogging(method: (req: NextRequest) => Promise<Response>) {
  return async (req: NextRequest) => {
    const url = new URL(req.url);
    console.log(`[Auth Route] ${req.method} ${url.pathname}${url.search}`);

    const res = await method(req);

    console.log(`[Auth Route] Response: ${res.status} for ${url.pathname}${url.search}`);
    if (!res.ok) {
      const body = await res.clone().text();
      console.error(`[Auth Route] Error body:`, body);
    }

    return res;
  };
}

export const GET = withLogging(handler.GET);
export const POST = withLogging(handler.POST);
