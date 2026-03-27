import axios, { type AxiosError } from "axios";
import { extractPlaylistId } from "./extract-playlist-id";
import { parseIso8601Duration } from "./parse-duration";
import type {
  PlaylistAnalyzeError,
  PlaylistAnalyzeResponse,
  PlaylistAnalyzeSuccess,
  PlaylistVideoRow,
  SkippedPlaylistEntry,
} from "./types";

const YT = "https://www.googleapis.com/youtube/v3";

type PlaylistItemShape = {
  snippet?: {
    title?: string;
    resourceId?: { videoId?: string };
  };
  contentDetails?: { videoId?: string };
};

type VideoResource = {
  id: string;
  contentDetails?: { duration?: string };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
  snippet?: { title?: string; publishedAt?: string };
};

type YtErrorBody = {
  error?: {
    code?: number;
    message?: string;
    errors?: { reason?: string; message?: string }[];
  };
};

function readYtError(data: unknown): string | undefined {
  const d = data as YtErrorBody;
  return d?.error?.errors?.[0]?.message || d?.error?.message;
}

function readYtReason(data: unknown): string | undefined {
  const d = data as YtErrorBody;
  return d?.error?.errors?.[0]?.reason;
}

function mapAxiosToError(err: unknown): PlaylistAnalyzeError {
  const ax = err as AxiosError<YtErrorBody>;
  const status = ax.response?.status;
  const data = ax.response?.data;
  const reason = readYtReason(data);
  const msg = readYtError(data) || ax.message;

  if (reason === "quotaExceeded" || reason === "dailyLimitExceeded") {
    return {
      ok: false,
      code: "quota_exceeded",
      message:
        "YouTube API quota exceeded. Please try again later or ask the site owner to check API usage.",
    };
  }

  if (status === 403) {
    return {
      ok: false,
      code: "forbidden_or_private",
      message:
        "This playlist cannot be accessed. It may be private, or the API key may lack access.",
    };
  }

  if (status === 404) {
    return {
      ok: false,
      code: "playlist_not_found",
      message: "Playlist not found. Check the URL or playlist ID.",
    };
  }

  if (ax.code === "ECONNABORTED" || ax.code === "ETIMEDOUT") {
    return {
      ok: false,
      code: "network_error",
      message: "Request timed out. Try again with a smaller range or later.",
    };
  }

  return {
    ok: false,
    code: "upstream_error",
    message: msg || "YouTube API request failed.",
  };
}

async function ytGet<T>(path: string, params: Record<string, string | number | undefined>) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    throw new Error("MISSING_API_KEY");
  }
  const { data, status } = await axios.get<T & YtErrorBody>(`${YT}/${path}`, {
    params: { ...params, key },
    timeout: 25_000,
    validateStatus: () => true,
  });
  if (status >= 400 || (data as YtErrorBody).error) {
    throw Object.assign(new Error(readYtError(data) || `HTTP ${status}`), {
      response: { status, data },
    });
  }
  return data as T;
}

const PLACEHOLDER_TITLES = new Set(["Deleted video", "Private video"]);

export async function fetchPlaylistAnalyze(
  playlistUrlOrId: string,
  rangeFrom: number | null,
  rangeTo: number | null,
): Promise<PlaylistAnalyzeResponse> {
  const playlistId = extractPlaylistId(playlistUrlOrId);
  if (!playlistId) {
    return {
      ok: false,
      code: "invalid_url",
      message: "Enter a valid YouTube playlist link (or a playlist ID).",
    };
  }

  if (!process.env.YOUTUBE_API_KEY) {
    return {
      ok: false,
      code: "missing_api_key",
      message: "Server is missing YOUTUBE_API_KEY. Add it to environment variables.",
    };
  }

  try {
    const playlistMeta = await ytGet<{ items?: { snippet?: { title?: string } }[] }>(
      "playlists",
      { part: "snippet", id: playlistId, maxResults: 1 },
    );
    if (!playlistMeta.items?.length) {
      return {
        ok: false,
        code: "playlist_not_found",
        message: "Playlist not found or is not visible to this API key.",
      };
    }
    const playlistTitle = playlistMeta.items[0]?.snippet?.title ?? null;

    type Slot = {
      playlistIndex: number;
      videoId: string | null;
      titleHint: string | null;
    };
    const slots: Slot[] = [];
    let pageToken: string | undefined;
    let page = 0;

    do {
      page += 1;
      if (page > 40) {
        return {
          ok: false,
          code: "upstream_error",
          message:
            "Playlist is very large (over ~2000 items in this tool’s fetch limit). Try a smaller playlist or a sub-range.",
        };
      }

      const plData = await ytGet<{
        items?: PlaylistItemShape[];
        nextPageToken?: string;
      }>("playlistItems", {
        part: "snippet,contentDetails",
        playlistId,
        maxResults: 50,
        pageToken,
      });

      const items = plData.items ?? [];
      for (const it of items) {
        const vid = it.contentDetails?.videoId || it.snippet?.resourceId?.videoId || null;
        const titleHint = it.snippet?.title?.trim() || null;
        slots.push({
          playlistIndex: slots.length + 1,
          videoId: vid,
          titleHint,
        });
      }

      pageToken = plData.nextPageToken;
    } while (pageToken);

    const totalItemsInPlaylist = slots.length;

    if (totalItemsInPlaylist === 0) {
      return {
        ok: false,
        code: "no_videos",
        message: "No items found in this playlist.",
      };
    }

    let from = rangeFrom;
    let to = rangeTo;
    if (from == null && to == null) {
      from = 1;
      to = totalItemsInPlaylist;
    } else {
      if (from == null) from = 1;
      if (to == null) to = totalItemsInPlaylist;
    }

    if (
      !Number.isInteger(from) ||
      !Number.isInteger(to) ||
      from < 1 ||
      to < 1 ||
      from > totalItemsInPlaylist ||
      to > totalItemsInPlaylist ||
      from > to
    ) {
      return {
        ok: false,
        code: "invalid_range",
        message: `From/To must be between 1 and ${totalItemsInPlaylist}, with From ≤ To.`,
      };
    }

    const slice = slots.slice(from! - 1, to!);

    const skipped: SkippedPlaylistEntry[] = [];
    const idsToFetch = new Set<string>();

    for (const s of slice) {
      if (!s.videoId) {
        skipped.push({
          playlistIndex: s.playlistIndex,
          videoId: null,
          reason: "missing_video_id",
          titleHint: s.titleHint,
        });
        continue;
      }
      if (s.titleHint && PLACEHOLDER_TITLES.has(s.titleHint)) {
        skipped.push({
          playlistIndex: s.playlistIndex,
          videoId: s.videoId,
          reason: s.titleHint === "Deleted video" ? "deleted" : "unavailable_or_private",
          titleHint: s.titleHint,
        });
        continue;
      }
      idsToFetch.add(s.videoId);
    }

    const uniqueIds = [...idsToFetch];
    const videoById = new Map<string, VideoResource>();

    for (let i = 0; i < uniqueIds.length; i += 50) {
      const chunk = uniqueIds.slice(i, i + 50);
      const vData = await ytGet<{ items?: VideoResource[] }>("videos", {
        part: "contentDetails,statistics,snippet",
        id: chunk.join(","),
        maxResults: 50,
      });
      for (const v of vData.items ?? []) {
        videoById.set(v.id, v);
      }
      if (uniqueIds.length > 50) {
        await new Promise((r) => setTimeout(r, 80));
      }
    }

    const videos: PlaylistVideoRow[] = [];
    const warnings: string[] = [];

    let position = 0;
    for (const s of slice) {
      if (!s.videoId || (s.titleHint && PLACEHOLDER_TITLES.has(s.titleHint))) {
        continue;
      }

      const v = videoById.get(s.videoId);
      if (!v) {
        skipped.push({
          playlistIndex: s.playlistIndex,
          videoId: s.videoId,
          reason: "unavailable_or_private",
          titleHint: s.titleHint,
        });
        continue;
      }

      const title = (v.snippet?.title || s.titleHint || "Untitled").trim();
      if (PLACEHOLDER_TITLES.has(title)) {
        skipped.push({
          playlistIndex: s.playlistIndex,
          videoId: s.videoId,
          reason: title === "Deleted video" ? "deleted" : "unavailable_or_private",
          titleHint: title,
        });
        continue;
      }

      const durationSeconds = parseIso8601Duration(v.contentDetails?.duration ?? "");

      position += 1;
      videos.push({
        position,
        playlistIndex: s.playlistIndex,
        videoId: s.videoId,
        title,
        durationSeconds,
        views: parseInt(v.statistics?.viewCount ?? "0", 10) || 0,
        likes: parseInt(v.statistics?.likeCount ?? "0", 10) || 0,
        comments: parseInt(v.statistics?.commentCount ?? "0", 10) || 0,
        publishedAt: v.snippet?.publishedAt ?? "",
        watchUrl: `https://www.youtube.com/watch?v=${s.videoId}`,
      });
    }

    if (skipped.length) {
      warnings.push(
        `${skipped.length} slot(s) in the selected range were skipped (private, deleted, or unavailable). Only public videos with details count toward totals.`,
      );
    }

    if (videos.length === 0) {
      return {
        ok: false,
        code: "no_videos",
        message:
          "No public video details in this range. Try a different range or playlist — private and removed videos are excluded.",
      };
    }

    const success: PlaylistAnalyzeSuccess = {
      ok: true,
      playlistId,
      playlistTitle,
      totalItemsInPlaylist,
      rangeFrom: from,
      rangeTo: to,
      videos,
      skipped,
      warnings,
    };

    return success;
  } catch (e) {
    if (e instanceof Error && e.message === "MISSING_API_KEY") {
      return {
        ok: false,
        code: "missing_api_key",
        message: "Server is missing YOUTUBE_API_KEY.",
      };
    }
    if (axios.isAxiosError(e)) {
      const data = e.response?.data as YtErrorBody;
      const reason = readYtReason(data);
      if (reason === "playlistNotFound") {
        return {
          ok: false,
          code: "playlist_not_found",
          message: "Playlist not found.",
        };
      }
      return mapAxiosToError(e);
    }
    return {
      ok: false,
      code: "upstream_error",
      message: e instanceof Error ? e.message : "Unknown error",
    };
  }
}
