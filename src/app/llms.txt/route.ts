import { NextResponse } from "next/server";
import { buildLlmsTxtBody } from "@/lib/llms-txt";

/** Public LLM/agent index per https://llmstxt.org/ (Markdown body, UTF-8). */
export async function GET() {
  const body = await buildLlmsTxtBody();
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
