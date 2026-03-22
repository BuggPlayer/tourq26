import type { NextRequest } from "next/server";

const DAILY_LIMIT = 20;
const TTL_SECONDS = 60 * 60 * 48; // rolling window cleanup

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 64);
  return "unknown";
}

function dayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function kvIsConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

/**
 * Returns false if under limit, true if rate limited.
 * If KV is not configured, allows the request (dev / local).
 */
export async function isToolsRateLimited(ip: string): Promise<boolean> {
  if (!kvIsConfigured()) return false;
  try {
    const { kv } = await import("@vercel/kv");
    const key = `tools:rate:${ip}:${dayKey()}`;
    const count = await kv.incr(key);
    if (count === 1) {
      await kv.expire(key, TTL_SECONDS);
    }
    return count > DAILY_LIMIT;
  } catch {
    return false;
  }
}

export { DAILY_LIMIT };
