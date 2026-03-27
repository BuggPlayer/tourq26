const RECENT_KEY = "ytpl-recent-v1";
const PINNED_KEY = "ytpl-pinned-v1";
const PREFS_KEY = "ytpl-prefs-v1";
const MAX_RECENT = 8;
const MAX_PINNED = 12;

export type RecentPlaylistEntry = {
  url: string;
  title: string | null;
  playlistId: string;
  at: number;
};

export type FavoritePlaylistEntry = {
  url: string;
  title: string | null;
  playlistId: string;
  pinnedAt: number;
};

export type YtplPrefsStored = {
  speed: "1" | "1.25" | "1.5" | "1.75" | "2";
  /** Opaque client state — validated when applied in the UI */
  listSort: unknown;
};

const DEFAULT_PREFS: YtplPrefsStored = {
  speed: "1",
  listSort: null,
};

function isSpeed(v: string): v is YtplPrefsStored["speed"] {
  return v === "1" || v === "1.25" || v === "1.5" || v === "1.75" || v === "2";
}

export function readRecentPlaylists(): RecentPlaylistEntry[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x): x is RecentPlaylistEntry =>
          x &&
          typeof x === "object" &&
          typeof (x as RecentPlaylistEntry).url === "string" &&
          typeof (x as RecentPlaylistEntry).playlistId === "string" &&
          typeof (x as RecentPlaylistEntry).at === "number",
      )
      .slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}

function writeRecent(entries: RecentPlaylistEntry[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(entries.slice(0, MAX_RECENT)));
  } catch {
    /* quota */
  }
}

export function pushRecentPlaylist(entry: Omit<RecentPlaylistEntry, "at"> & { at?: number }) {
  const at = entry.at ?? Date.now();
  const next: RecentPlaylistEntry = {
    url: entry.url.trim(),
    title: entry.title,
    playlistId: entry.playlistId,
    at,
  };
  const prev = readRecentPlaylists().filter((p) => p.playlistId !== next.playlistId);
  writeRecent([next, ...prev].slice(0, MAX_RECENT));
}

export function removeRecentPlaylist(playlistId: string) {
  writeRecent(readRecentPlaylists().filter((p) => p.playlistId !== playlistId));
}

export function clearRecentPlaylists() {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch {
    /* noop */
  }
}

export function readPinnedPlaylists(): FavoritePlaylistEntry[] {
  try {
    const raw = localStorage.getItem(PINNED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x): x is FavoritePlaylistEntry =>
          x &&
          typeof x === "object" &&
          typeof (x as FavoritePlaylistEntry).url === "string" &&
          typeof (x as FavoritePlaylistEntry).playlistId === "string" &&
          typeof (x as FavoritePlaylistEntry).pinnedAt === "number",
      )
      .slice(0, MAX_PINNED);
  } catch {
    return [];
  }
}

function writePinned(entries: FavoritePlaylistEntry[]) {
  try {
    localStorage.setItem(PINNED_KEY, JSON.stringify(entries.slice(0, MAX_PINNED)));
  } catch {
    /* quota */
  }
}

/** @returns true if playlist is pinned after toggle, false if removed */
export function togglePinnedPlaylist(
  entry: Omit<FavoritePlaylistEntry, "pinnedAt"> & { pinnedAt?: number },
): boolean {
  const list = readPinnedPlaylists();
  const id = entry.playlistId;
  if (list.some((p) => p.playlistId === id)) {
    writePinned(list.filter((p) => p.playlistId !== id));
    return false;
  }
  const next: FavoritePlaylistEntry = {
    url: entry.url.trim(),
    title: entry.title,
    playlistId: id,
    pinnedAt: entry.pinnedAt ?? Date.now(),
  };
  writePinned([next, ...list.filter((p) => p.playlistId !== id)].slice(0, MAX_PINNED));
  return true;
}

export function removePinnedPlaylist(playlistId: string) {
  writePinned(readPinnedPlaylists().filter((p) => p.playlistId !== playlistId));
}

export function clearPinnedPlaylists() {
  try {
    localStorage.removeItem(PINNED_KEY);
  } catch {
    /* noop */
  }
}

export function readYtplPrefs(): YtplPrefsStored {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    const o = JSON.parse(raw) as Record<string, unknown>;
    const speed = typeof o.speed === "string" && isSpeed(o.speed) ? o.speed : DEFAULT_PREFS.speed;
    const listSort = "listSort" in o ? o.listSort : null;
    return { speed, listSort };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function writeYtplPrefs(partial: Partial<YtplPrefsStored>) {
  try {
    const cur = readYtplPrefs();
    const next: YtplPrefsStored = {
      speed: partial.speed ?? cur.speed,
      listSort: partial.listSort !== undefined ? partial.listSort : cur.listSort,
    };
    localStorage.setItem(PREFS_KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }
}

export function sanitizeFilenameBase(name: string): string {
  return name
    .trim()
    .slice(0, 80)
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "playlist";
}
