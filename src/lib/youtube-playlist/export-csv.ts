import type { PlaylistVideoRow } from "./types";
import { sanitizeFilenameBase } from "./client-prefs";

function csvCell(v: string | number): string {
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function buildPlaylistCsv(rows: PlaylistVideoRow[]): string {
  const headers = [
    "display_order",
    "playlist_index",
    "video_id",
    "title",
    "duration_seconds",
    "views",
    "likes",
    "comments",
    "watch_url",
  ];
  const lines = [headers.join(",")];
  for (const v of rows) {
    lines.push(
      [
        v.position,
        v.playlistIndex,
        v.videoId,
        v.title,
        v.durationSeconds,
        v.views,
        v.likes,
        v.comments,
        v.watchUrl,
      ]
        .map(csvCell)
        .join(","),
    );
  }
  return `\uFEFF${lines.join("\n")}`;
}

export function downloadPlaylistCsv(rows: PlaylistVideoRow[], playlistTitle: string | null) {
  const csv = buildPlaylistCsv(rows);
  const base = sanitizeFilenameBase(playlistTitle ?? "youtube-playlist");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${base}-videos.csv`;
  a.rel = "noopener";
  a.click();
  URL.revokeObjectURL(url);
}
