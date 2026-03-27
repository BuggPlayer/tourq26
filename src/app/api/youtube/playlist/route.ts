import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchPlaylistAnalyze } from "@/lib/youtube-playlist/fetch-playlist-data";
import type { PlaylistAnalyzeSuccess } from "@/lib/youtube-playlist/types";

/** Vercel / Node — large playlists need time for paginated fetches. */
export const maxDuration = 60;

const bodySchema = z.object({
  playlistUrl: z.string().min(1, "Playlist URL is required").max(2000),
  from: z.number().int().positive().optional().nullable(),
  to: z.number().int().positive().optional().nullable(),
});

type CacheEntry = { expires: number; payload: PlaylistAnalyzeSuccess };
const successCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_CACHE_ENTRIES = 48;

function cacheKey(playlistUrl: string, from: string, to: string) {
  return `${playlistUrl.trim()}|${from}|${to}`;
}

function cacheGet(key: string): PlaylistAnalyzeSuccess | null {
  const e = successCache.get(key);
  if (!e) return null;
  if (e.expires < Date.now()) {
    successCache.delete(key);
    return null;
  }
  return e.payload;
}

function cacheSet(key: string, payload: PlaylistAnalyzeSuccess) {
  while (successCache.size >= MAX_CACHE_ENTRIES) {
    const oldest = successCache.keys().next().value;
    if (oldest === undefined) break;
    successCache.delete(oldest);
  }
  successCache.set(key, { expires: Date.now() + CACHE_TTL_MS, payload });
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "upstream_error", message: "Invalid JSON body." } as const,
      { status: 400 },
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join(" ");
    return NextResponse.json(
      { ok: false, code: "invalid_url", message: msg || "Invalid request." } as const,
      { status: 400 },
    );
  }

  const { playlistUrl, from: fromRaw, to: toRaw } = parsed.data;
  if (fromRaw != null && toRaw != null && fromRaw > toRaw) {
    return NextResponse.json(
      {
        ok: false,
        code: "invalid_range",
        message: "From must be less than or equal to To.",
      } as const,
      { status: 400 },
    );
  }

  const fromS = fromRaw == null ? "" : String(fromRaw);
  const toS = toRaw == null ? "" : String(toRaw);
  const key = cacheKey(playlistUrl, fromS, toS);
  const hit = cacheGet(key);
  if (hit) {
    return NextResponse.json({ ...hit, cached: true as const });
  }

  const result = await fetchPlaylistAnalyze(
    playlistUrl,
    fromRaw ?? null,
    toRaw ?? null,
  );

  if (result.ok) {
    cacheSet(key, result);
    return NextResponse.json({ ...result, cached: false as const });
  }

  const status =
    result.code === "invalid_url" || result.code === "invalid_range"
      ? 400
      : result.code === "missing_api_key"
        ? 503
        : result.code === "quota_exceeded"
          ? 429
          : result.code === "playlist_not_found" || result.code === "no_videos"
            ? 404
            : 502;

  return NextResponse.json(result, { status });
}
