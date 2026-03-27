import type { PlaylistVideoRow } from "@/lib/youtube-playlist/types";

export type PresetSortId =
  | "original"
  | "latest"
  | "oldest"
  | "views"
  | "likes"
  | "shortest"
  | "longest";

export type ColumnSortKey =
  | "position"
  | "title"
  | "duration"
  | "views"
  | "likes"
  | "comments"
  | "publishedAt";

export type ListSortState =
  | { kind: "preset"; preset: PresetSortId }
  | { kind: "column"; key: ColumnSortKey; dir: "asc" | "desc" };

function cmpNum(a: number, b: number) {
  return a - b;
}

function cmpStr(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

export function defaultDirForColumn(key: ColumnSortKey): "asc" | "desc" {
  switch (key) {
    case "views":
    case "likes":
    case "comments":
    case "duration":
    case "publishedAt":
      return "desc";
    default:
      return "asc";
  }
}

export function sortPlaylistVideos(rows: PlaylistVideoRow[], state: ListSortState): PlaylistVideoRow[] {
  const copy = [...rows];

  if (state.kind === "preset") {
    switch (state.preset) {
      case "original":
        return copy.sort((a, b) => cmpNum(a.playlistIndex, b.playlistIndex));
      case "latest":
        return copy.sort((a, b) =>
          cmpNum(new Date(b.publishedAt).getTime(), new Date(a.publishedAt).getTime()),
        );
      case "oldest":
        return copy.sort((a, b) =>
          cmpNum(new Date(a.publishedAt).getTime(), new Date(b.publishedAt).getTime()),
        );
      case "views":
        return copy.sort((a, b) => cmpNum(b.views, a.views));
      case "likes":
        return copy.sort((a, b) => cmpNum(b.likes, a.likes));
      case "shortest":
        return copy.sort((a, b) => cmpNum(a.durationSeconds, b.durationSeconds));
      case "longest":
        return copy.sort((a, b) => cmpNum(b.durationSeconds, a.durationSeconds));
      default:
        return copy;
    }
  }

  const { key, dir } = state;
  const mul = dir === "asc" ? 1 : -1;

  return copy.sort((a, b) => {
    switch (key) {
      case "position":
        return mul * cmpNum(a.playlistIndex, b.playlistIndex);
      case "title":
        return mul * cmpStr(a.title, b.title);
      case "duration":
        return mul * cmpNum(a.durationSeconds, b.durationSeconds);
      case "views":
        return mul * cmpNum(a.views, b.views);
      case "likes":
        return mul * cmpNum(a.likes, b.likes);
      case "comments":
        return mul * cmpNum(a.comments, b.comments);
      case "publishedAt":
        return mul * cmpNum(new Date(a.publishedAt).getTime(), new Date(b.publishedAt).getTime());
      default:
        return 0;
    }
  });
}

const PRESET_IDS: PresetSortId[] = [
  "original",
  "latest",
  "oldest",
  "views",
  "likes",
  "shortest",
  "longest",
];

function isPresetId(v: string): v is PresetSortId {
  return (PRESET_IDS as string[]).includes(v);
}

function isColumnKey(v: string): v is ColumnSortKey {
  return (
    v === "position" ||
    v === "title" ||
    v === "duration" ||
    v === "views" ||
    v === "likes" ||
    v === "comments" ||
    v === "publishedAt"
  );
}

/** Restore sort state from localStorage JSON */
export function parseStoredListSort(raw: unknown): ListSortState | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (o.kind === "preset" && typeof o.preset === "string" && isPresetId(o.preset)) {
    return { kind: "preset", preset: o.preset };
  }
  if (
    o.kind === "column" &&
    typeof o.key === "string" &&
    isColumnKey(o.key) &&
    (o.dir === "asc" || o.dir === "desc")
  ) {
    return { kind: "column", key: o.key, dir: o.dir };
  }
  return null;
}
