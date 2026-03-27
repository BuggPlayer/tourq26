"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import {
  clearPinnedPlaylists,
  clearRecentPlaylists,
  pushRecentPlaylist,
  readPinnedPlaylists,
  readRecentPlaylists,
  readYtplPrefs,
  removePinnedPlaylist,
  removeRecentPlaylist,
  togglePinnedPlaylist,
  writeYtplPrefs,
  type FavoritePlaylistEntry,
  type RecentPlaylistEntry,
} from "@/lib/youtube-playlist/client-prefs";
import { downloadPlaylistCsv } from "@/lib/youtube-playlist/export-csv";
import { extractPlaylistId } from "@/lib/youtube-playlist/extract-playlist-id";
import { formatDurationHuman } from "@/lib/youtube-playlist/format-duration";
import type { PlaylistAnalyzeApiSuccess, PlaylistAnalyzeError } from "@/lib/youtube-playlist/types";
import { KeyboardShortcutsDialog } from "./KeyboardShortcutsDialog";
import { PlaylistLengthTable } from "./PlaylistLengthTable";
import {
  defaultDirForColumn,
  parseStoredListSort,
  type ColumnSortKey,
  type ListSortState,
  type PresetSortId,
  sortPlaylistVideos,
} from "./sort-videos";

const SPEEDS = [
  { value: "1", mult: 1, label: "1×" },
  { value: "1.25", mult: 1.25, label: "1.25×" },
  { value: "1.5", mult: 1.5, label: "1.5×" },
  { value: "1.75", mult: 1.75, label: "1.75×" },
  { value: "2", mult: 2, label: "2×" },
] as const;

const formSchema = z.object({
  playlistUrl: z.string().min(1, "Paste a playlist or watch URL with list="),
  from: z.string().optional(),
  to: z.string().optional(),
  speed: z.enum(["1", "1.25", "1.5", "1.75", "2"]),
});

type FormValues = z.infer<typeof formSchema>;

const CLIENT_CACHE_TTL_MS = 60 * 60 * 1000;
const LS_PREFIX = "ytpl:v1:";

function parseOptionalPos(s: string | undefined): number | null {
  const t = s?.trim();
  if (!t) return null;
  const n = parseInt(t, 10);
  if (!Number.isInteger(n) || n < 1) return null;
  return n;
}

function cacheKeyParts(playlistUrl: string, fromStr: string, toStr: string) {
  const id = extractPlaylistId(playlistUrl);
  if (!id) return null;
  return `${LS_PREFIX}${id}:${fromStr || "d"}:${toStr || "d"}`;
}

function readClientCache(key: string): PlaylistAnalyzeApiSuccess | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { savedAt: number; data: PlaylistAnalyzeApiSuccess };
    if (!parsed?.savedAt || !parsed?.data?.ok) return null;
    if (Date.now() - parsed.savedAt > CLIENT_CACHE_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

function writeClientCache(key: string, data: PlaylistAnalyzeApiSuccess) {
  try {
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    /* quota / private mode */
  }
}

const PRESETS: { id: PresetSortId; label: string; title: string }[] = [
  { id: "original", label: "Playlist order", title: "Original order from the playlist" },
  { id: "latest", label: "Latest first", title: "Newest publish date first" },
  { id: "oldest", label: "Oldest first", title: "Oldest publish date first" },
  { id: "views", label: "Most viewed", title: "Highest view count first" },
  { id: "likes", label: "Most liked", title: "Highest like count first" },
  { id: "shortest", label: "Shortest", title: "Shortest duration first" },
  { id: "longest", label: "Longest", title: "Longest duration first" },
];

function IconLink({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPlay({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

function IconRefresh({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M23 4v6h-6M1 20v-6h6" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCopy({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function IconShare({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
    </svg>
  );
}

function IconBarChart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 20V10M18 20V4M6 20v-4" strokeLinecap="round" />
    </svg>
  );
}

function scrollToResults() {
  requestAnimationFrame(() => {
    document.getElementById("ytpl-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function isEditableTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  if (el.closest("[role=\"combobox\"]")) return true;
  if (el.closest("dialog[open]")) return true;
  return false;
}

function IconKeyboard({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" strokeLinecap="round" />
    </svg>
  );
}

function IconDownload({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTrash({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconStarOutline({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconStarFilled({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

type QuickPlaylistEntry = RecentPlaylistEntry | FavoritePlaylistEntry;

export function YouTubePlaylistLengthClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [result, setResult] = useState<PlaylistAnalyzeApiSuccess | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fromCache, setFromCache] = useState(false);
  const [listSort, setListSort] = useState<ListSortState>({ kind: "preset", preset: "original" });
  const [hydratedFromUrl, setHydratedFromUrl] = useState(false);
  const [copyLabel, setCopyLabel] = useState<"Copy summary" | "Copied!">("Copy summary");
  const [shareLabel, setShareLabel] = useState<"Copy share link" | "Link copied!">("Copy share link");
  const [tableFilter, setTableFilter] = useState("");
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [recentList, setRecentList] = useState<ReturnType<typeof readRecentPlaylists>>([]);
  const [pinnedList, setPinnedList] = useState<FavoritePlaylistEntry[]>([]);
  const [csvLabel, setCsvLabel] = useState("Export CSV");
  const [copyTitlesLabel, setCopyTitlesLabel] = useState("Copy all titles");
  const [prefsReady, setPrefsReady] = useState(false);
  const prefsInitRef = useRef(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playlistUrl: "",
      from: "",
      to: "",
      speed: "1",
    },
  });

  const speedVal = form.watch("speed");
  const playlistUrlWatch = form.watch("playlistUrl");
  const speedMult = useMemo(
    () => SPEEDS.find((s) => s.value === speedVal)?.mult ?? 1,
    [speedVal],
  );

  const detectedId = useMemo(() => {
    const t = playlistUrlWatch?.trim();
    if (!t) return null;
    return extractPlaylistId(t);
  }, [playlistUrlWatch]);

  const syncUrl = useCallback(
    (values: FormValues) => {
      const p = new URLSearchParams();
      if (values.playlistUrl.trim()) p.set("url", values.playlistUrl.trim());
      if (values.from?.trim()) p.set("from", values.from.trim());
      if (values.to?.trim()) p.set("to", values.to.trim());
      if (values.speed && values.speed !== "1") p.set("speed", values.speed);
      const qs = p.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  useEffect(() => {
    if (hydratedFromUrl) return;
    const url = searchParams.get("url");
    const from = searchParams.get("from") ?? "";
    const to = searchParams.get("to") ?? "";
    const speed = searchParams.get("speed");
    if (url) form.setValue("playlistUrl", url);
    if (from) form.setValue("from", from);
    if (to) form.setValue("to", to);
    if (speed && ["1", "1.25", "1.5", "1.75", "2"].includes(speed)) {
      form.setValue("speed", speed as FormValues["speed"]);
    }
    setHydratedFromUrl(true);
  }, [searchParams, form, hydratedFromUrl]);

  useEffect(() => {
    setRecentList(readRecentPlaylists());
    setPinnedList(readPinnedPlaylists());
  }, []);

  const pinnedIds = useMemo(() => new Set(pinnedList.map((p) => p.playlistId)), [pinnedList]);

  const recentWithoutPinned = useMemo(
    () => recentList.filter((r) => !pinnedIds.has(r.playlistId)),
    [recentList, pinnedIds],
  );

  useEffect(() => {
    if (!hydratedFromUrl || prefsInitRef.current) return;
    prefsInitRef.current = true;
    const prefs = readYtplPrefs();
    if (!searchParams.get("speed")) {
      form.setValue("speed", prefs.speed, { shouldValidate: true });
    }
    const storedSort = parseStoredListSort(prefs.listSort);
    if (!searchParams.get("url") && storedSort) {
      setListSort(storedSort);
    }
    setPrefsReady(true);
  }, [hydratedFromUrl, searchParams, form]);

  useEffect(() => {
    if (!prefsReady) return;
    writeYtplPrefs({ speed: speedVal, listSort });
  }, [prefsReady, speedVal, listSort]);

  const sortedVideos = useMemo(() => {
    if (!result?.videos?.length) return [];
    return sortPlaylistVideos(result.videos, listSort);
  }, [result, listSort]);

  const filteredVideos = useMemo(() => {
    const q = tableFilter.trim().toLowerCase();
    if (!q) return sortedVideos;
    return sortedVideos.filter((v) => v.title.toLowerCase().includes(q));
  }, [sortedVideos, tableFilter]);

  const totals = useMemo(() => {
    if (!result?.videos?.length) {
      return { seconds: 0, count: 0, avg: 0 };
    }
    const seconds = result.videos.reduce((acc, v) => acc + v.durationSeconds, 0);
    const count = result.videos.length;
    return { seconds, count, avg: count ? seconds / count : 0 };
  }, [result]);

  const onColumnSort = useCallback(
    (key: ColumnSortKey) => {
      setListSort((prev) => {
        if (prev.kind === "column" && prev.key === key) {
          return { kind: "column", key, dir: prev.dir === "asc" ? "desc" : "asc" };
        }
        return { kind: "column", key, dir: defaultDirForColumn(key) };
      });
    },
    [],
  );

  const onPreset = useCallback((preset: PresetSortId) => {
    setListSort({ kind: "preset", preset });
  }, []);

  const runAnalyze = useCallback(
    async (values: FormValues, opts?: { skipCache?: boolean }) => {
      setFetchError(null);
      setFromCache(false);
      setTableFilter("");

      const fromN = parseOptionalPos(values.from);
      const toN = parseOptionalPos(values.to);
      if (values.from?.trim() && fromN == null) {
        setFetchError("From must be a positive whole number.");
        return;
      }
      if (values.to?.trim() && toN == null) {
        setFetchError("To must be a positive whole number.");
        return;
      }
      if (fromN != null && toN != null && fromN > toN) {
        setFetchError("From cannot be greater than To.");
        return;
      }

      const fromStr = values.from?.trim() ?? "";
      const toStr = values.to?.trim() ?? "";
      const ck = cacheKeyParts(values.playlistUrl, fromStr, toStr);
      if (!opts?.skipCache && ck) {
        const hit = readClientCache(ck);
        if (hit) {
          setResult(hit);
          setFromCache(true);
          pushRecentPlaylist({
            url: values.playlistUrl.trim(),
            title: hit.playlistTitle,
            playlistId: hit.playlistId,
          });
          setRecentList(readRecentPlaylists());
          syncUrl(values);
          scrollToResults();
          return;
        }
      }

      setLoading(true);
      try {
        const { data } = await axios.post<PlaylistAnalyzeApiSuccess | PlaylistAnalyzeError>(
          "/api/youtube/playlist",
          {
            playlistUrl: values.playlistUrl.trim(),
            from: fromN ?? undefined,
            to: toN ?? undefined,
          },
          { timeout: 120_000 },
        );

        if (!data.ok) {
          setResult(null);
          setFetchError(data.message);
          return;
        }

        setResult(data);
        if (ck) writeClientCache(ck, data);
        pushRecentPlaylist({
          url: values.playlistUrl.trim(),
          title: data.playlistTitle,
          playlistId: data.playlistId,
        });
        setRecentList(readRecentPlaylists());
        syncUrl(values);
        scrollToResults();
      } catch (e) {
        setResult(null);
        if (axios.isAxiosError(e)) {
          const body = e.response?.data as PlaylistAnalyzeError | undefined;
          setFetchError(
            body?.message ||
              (e.response?.status === 429
                ? "Quota exceeded. Try again later."
                : "Network error. Check your connection and retry."),
          );
        } else {
          setFetchError("Something went wrong. Please retry.");
        }
      } finally {
        setLoading(false);
      }
    },
    [syncUrl],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (shortcutsOpen) return;

      if (e.shiftKey && e.key === "?") {
        if (isEditableTarget(e.target)) return;
        e.preventDefault();
        setShortcutsOpen(true);
        return;
      }

      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (isEditableTarget(e.target)) return;
        if (!result) return;
        e.preventDefault();
        document.getElementById("ytpl-table-filter")?.focus();
        return;
      }

      if (e.key === "Escape") {
        const t = e.target as HTMLElement;
        if (t.id === "ytpl-table-filter" && tableFilter) {
          setTableFilter("");
          e.preventDefault();
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        const t = e.target as HTMLElement;
        if (t.id !== "playlistUrl") return;
        if (loading) return;
        e.preventDefault();
        void form.handleSubmit((v) => runAnalyze(v))();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcutsOpen, result, tableFilter, loading, form, runAnalyze]);

  const onSubmit = form.handleSubmit((values) => runAnalyze(values));

  const copySummary = useCallback(async () => {
    if (!result?.ok) return;
    const adj = totals.seconds / speedMult;
    const lines = [
      result.playlistTitle ? `Playlist: ${result.playlistTitle}` : `Playlist ID: ${result.playlistId}`,
      `Videos counted: ${totals.count}`,
      `Total duration: ${formatDurationHuman(totals.seconds)}`,
      `At ${speedMult}× playback: ${formatDurationHuman(adj)}`,
      `Average length: ${formatDurationHuman(totals.avg)}`,
    ];
    const text = lines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopyLabel("Copied!");
      window.setTimeout(() => setCopyLabel("Copy summary"), 2000);
    } catch {
      window.prompt("Copy:", text);
    }
  }, [result, speedMult, totals.avg, totals.count, totals.seconds]);

  const shareLink = useCallback(() => {
    const v = form.getValues();
    syncUrl(v);
    const qs = new URLSearchParams();
    if (v.playlistUrl.trim()) qs.set("url", v.playlistUrl.trim());
    if (v.from?.trim()) qs.set("from", v.from.trim());
    if (v.to?.trim()) qs.set("to", v.to.trim());
    if (v.speed && v.speed !== "1") qs.set("speed", v.speed);
    const full = `${window.location.origin}${pathname}${qs.toString() ? `?${qs}` : ""}`;
    void navigator.clipboard.writeText(full).then(
      () => {
        setShareLabel("Link copied!");
        window.setTimeout(() => setShareLabel("Copy share link"), 2200);
      },
      () => {
        window.prompt("Copy link:", full);
      },
    );
  }, [form, pathname, syncUrl]);

  const clearResults = useCallback(() => {
    setResult(null);
    setFetchError(null);
    setTableFilter("");
    setListSort({ kind: "preset", preset: "original" });
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const applyQuickPlaylist = useCallback((entry: QuickPlaylistEntry) => {
    form.setValue("playlistUrl", entry.url, { shouldDirty: true, shouldValidate: true });
    window.requestAnimationFrame(() => document.getElementById("playlistUrl")?.focus());
  }, [form]);

  const removeRecentEntry = useCallback((playlistId: string) => {
    removeRecentPlaylist(playlistId);
    setRecentList(readRecentPlaylists());
  }, []);

  const clearAllRecent = useCallback(() => {
    clearRecentPlaylists();
    setRecentList([]);
  }, []);

  const removePinnedEntry = useCallback((playlistId: string) => {
    removePinnedPlaylist(playlistId);
    setPinnedList(readPinnedPlaylists());
  }, []);

  const clearAllPinned = useCallback(() => {
    clearPinnedPlaylists();
    setPinnedList([]);
  }, []);

  const toggleCurrentPlaylistPin = useCallback(() => {
    if (!result?.ok) return;
    const url =
      form.getValues().playlistUrl.trim() ||
      `https://www.youtube.com/playlist?list=${result.playlistId}`;
    togglePinnedPlaylist({
      url,
      title: result.playlistTitle,
      playlistId: result.playlistId,
    });
    setPinnedList(readPinnedPlaylists());
  }, [result, form]);

  const copyAllTitles = useCallback(async () => {
    if (filteredVideos.length === 0) return;
    const text = filteredVideos.map((v) => v.title).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopyTitlesLabel("Titles copied!");
      window.setTimeout(() => setCopyTitlesLabel("Copy all titles"), 2000);
    } catch {
      window.prompt("Copy titles (one per line):", text);
    }
  }, [filteredVideos]);

  const exportCsv = useCallback(() => {
    if (!result?.ok || filteredVideos.length === 0) return;
    downloadPlaylistCsv(filteredVideos, result.playlistTitle);
    setCsvLabel("Exported!");
    window.setTimeout(() => setCsvLabel("Export CSV"), 2000);
  }, [result, filteredVideos]);

  const showWelcome =
    hydratedFromUrl && !result && !loading && !fetchError && !playlistUrlWatch?.trim();

  const currentPlaylistPinned = Boolean(result?.ok && pinnedIds.has(result.playlistId));

  return (
    <div className="space-y-8 sm:space-y-10">
      {showWelcome ? (
        <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary-muted/40 via-surface-elevated/30 to-accent-muted/25 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <IconPlay className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">How it works</h2>
              <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
                <li>Paste a playlist URL or a watch link that includes a playlist ID.</li>
                <li>Use From / To only if you want a slice of the list (counts YouTube playlist positions).</li>
                <li>Pick a playback speed to see how long a binge would take at that rate.</li>
                <li>
                  Press <kbd className="rounded border border-border bg-background px-1 font-mono text-xs">?</kbd> for
                  keyboard shortcuts; <kbd className="rounded border border-border bg-background px-1 font-mono text-xs">/</kbd>{" "}
                  focuses the title filter after results load.
                </li>
                <li>
                  <strong className="text-foreground/90">Star</strong> playlists to keep them on top;{" "}
                  <strong className="text-foreground/90">Copy all titles</strong> grabs the visible table rows (respects filter
                  and sort).
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      <section
        aria-labelledby="ytpl-form-heading"
        className="relative overflow-hidden rounded-2xl border border-border/60 bg-surface-elevated/25 shadow-[var(--shadow-card)] ring-1 ring-border/30"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent"
          aria-hidden
        />
        <div className="p-5 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <h2 id="ytpl-form-heading" className="font-display text-xl font-semibold tracking-tight text-foreground">
                Analyze a playlist
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Paste a playlist or watch URL with <code className="rounded-md bg-muted/50 px-1.5 py-0.5 text-xs">list=</code>.
                Your API key never leaves the server.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShortcutsOpen(true)}
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            >
              <IconKeyboard className="h-4 w-4" />
              Shortcuts
              <kbd className="hidden rounded border border-border bg-muted/40 px-1.5 font-mono text-[0.65rem] text-muted-foreground sm:inline">
                ?
              </kbd>
            </button>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-8">
            <div>
              <label htmlFor="playlistUrl" className="text-sm font-semibold text-foreground">
                Playlist URL
              </label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <IconLink className="h-4 w-4" />
                </span>
                <input
                  id="playlistUrl"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="https://www.youtube.com/playlist?list=…"
                  aria-describedby="ytpl-url-kbd-hint"
                  className="w-full rounded-xl border border-border bg-background py-3.5 pl-11 pr-4 text-sm text-foreground shadow-sm placeholder:text-muted-foreground transition focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring"
                  {...form.register("playlistUrl")}
                />
              </div>
              {detectedId ? (
                <p className="mt-2 flex items-center gap-2 text-xs text-success">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
                  Playlist ID detected — ready to calculate
                </p>
              ) : playlistUrlWatch?.trim() ? (
                <p className="mt-2 text-xs text-muted-foreground">Could not read a playlist ID yet — check the link.</p>
              ) : null}
              {form.formState.errors.playlistUrl ? (
                <p className="mt-2 text-sm text-destructive" role="alert">
                  {form.formState.errors.playlistUrl.message}
                </p>
              ) : null}
              <p id="ytpl-url-kbd-hint" className="mt-2 text-xs text-muted-foreground">
                <kbd className="rounded border border-border bg-muted/30 px-1 font-mono text-[0.65rem]">Ctrl</kbd>{" "}
                <span className="text-muted-foreground/80">or</span>{" "}
                <kbd className="rounded border border-border bg-muted/30 px-1 font-mono text-[0.65rem]">⌘</kbd>
                <span className="text-muted-foreground/80"> + </span>
                <kbd className="rounded border border-border bg-muted/30 px-1 font-mono text-[0.65rem]">Enter</kbd> in this
                field runs Calculate.
              </p>

              {pinnedList.length > 0 ? (
                <div className="mt-4 rounded-xl border border-accent/35 bg-accent-muted/30 p-3 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                      <IconStarFilled className="h-3.5 w-3.5 text-primary" aria-hidden />
                      Pinned
                    </span>
                    <button
                      type="button"
                      onClick={clearAllPinned}
                      className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                    >
                      Unpin all
                    </button>
                  </div>
                  <ul className="mt-2 flex flex-wrap gap-2" aria-label="Pinned playlists">
                    {pinnedList.map((p) => (
                      <li key={p.playlistId} className="group relative max-w-full">
                        <button
                          type="button"
                          onClick={() => applyQuickPlaylist(p)}
                          className="flex max-w-[min(100%,18rem)] items-center gap-1.5 rounded-full border border-accent/40 bg-background py-1.5 pl-3 pr-8 text-left text-xs font-medium text-foreground transition hover:border-primary/50"
                          title={p.url}
                        >
                          <IconStarFilled className="h-3 w-3 shrink-0 text-primary" aria-hidden />
                          <span className="truncate">{p.title || p.playlistId}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removePinnedEntry(p.playlistId)}
                          className="absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground opacity-70 hover:bg-destructive/15 hover:text-destructive"
                          aria-label={`Unpin ${p.title || p.playlistId}`}
                        >
                          <IconTrash className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {recentWithoutPinned.length > 0 ? (
                <div className="mt-4 rounded-xl border border-border/60 bg-muted/[0.06] p-3 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent</span>
                    <button
                      type="button"
                      onClick={clearAllRecent}
                      className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                  <ul className="mt-2 flex flex-wrap gap-2" aria-label="Recent playlists">
                    {recentWithoutPinned.map((r) => (
                      <li key={r.playlistId} className="group relative max-w-full">
                        <button
                          type="button"
                          onClick={() => applyQuickPlaylist(r)}
                          className="flex max-w-[min(100%,18rem)] items-center gap-1 rounded-full border border-border bg-background py-1.5 pl-3 pr-8 text-left text-xs font-medium text-foreground transition hover:border-primary/40"
                          title={r.url}
                        >
                          <span className="truncate">{r.title || r.playlistId}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeRecentEntry(r.playlistId)}
                          className="absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground opacity-70 hover:bg-destructive/15 hover:text-destructive"
                          aria-label={`Remove ${r.title || r.playlistId} from recent`}
                        >
                          <IconTrash className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <fieldset className="rounded-2xl border border-dashed border-border/70 bg-muted/[0.07] p-4 sm:p-5">
              <legend className="px-1 font-display text-sm font-semibold text-foreground">Options</legend>
              <p className="mb-5 text-xs text-muted-foreground">All optional — leave blank to use the full playlist.</p>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="from" className="text-sm font-medium text-foreground">
                      From
                    </label>
                    <input
                      id="from"
                      type="number"
                      min={1}
                      inputMode="numeric"
                      placeholder="Start (e.g. 1)"
                      className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm tabular-nums shadow-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring"
                      {...form.register("from")}
                    />
                    <p className="mt-1.5 text-xs leading-snug text-muted-foreground">First playlist position to include.</p>
                  </div>
                  <div>
                    <label htmlFor="to" className="text-sm font-medium text-foreground">
                      To
                    </label>
                    <input
                      id="to"
                      type="number"
                      min={1}
                      inputMode="numeric"
                      placeholder="End (last slot)"
                      className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm tabular-nums shadow-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring"
                      {...form.register("to")}
                    />
                    <p className="mt-1.5 text-xs leading-snug text-muted-foreground">Last position to include.</p>
                  </div>
                </div>

                <div>
                  <span id="speed-label" className="text-sm font-medium text-foreground">
                    Playback speed
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">Estimated watch time if you play everything at this speed.</p>
                  <div
                    className="mt-3 flex flex-wrap gap-2"
                    role="group"
                    aria-labelledby="speed-label"
                  >
                    {SPEEDS.map((s) => {
                      const active = speedVal === s.value;
                      return (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => {
                            form.setValue("speed", s.value, { shouldValidate: true, shouldDirty: true });
                          }}
                          className={`min-w-[3.25rem] rounded-lg px-3 py-2 text-sm font-semibold tabular-nums transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            active
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "border border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          }`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                  <input type="hidden" {...form.register("speed")} />
                </div>
              </div>
            </fieldset>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-cta)] transition hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-55"
              >
                {loading ? (
                  <>
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground motion-reduce:animate-none"
                      aria-hidden
                    />
                    Calculating…
                  </>
                ) : (
                  <>
                    <IconBarChart className="h-4 w-4 opacity-90" />
                    Calculate length
                  </>
                )}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => runAnalyze(form.getValues(), { skipCache: true })}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-medium text-foreground transition hover:bg-muted/25 disabled:opacity-55"
              >
                <IconRefresh className="h-4 w-4 text-muted-foreground" />
                Refresh (skip cache)
              </button>
              {result?.ok ? (
                <button
                  type="button"
                  onClick={clearResults}
                  className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline sm:ml-1"
                >
                  Clear results
                </button>
              ) : null}
            </div>
          </form>

          {fetchError ? (
            <div
              className="mt-6 flex gap-3 rounded-xl border border-destructive/35 bg-destructive/10 px-4 py-3.5"
              role="alert"
            >
              <span className="mt-0.5 shrink-0 text-destructive" aria-hidden>
                !
              </span>
              <p className="text-sm leading-relaxed text-destructive">{fetchError}</p>
            </div>
          ) : null}

          {loading ? (
            <div className="mt-8 space-y-4 rounded-xl border border-border/60 bg-muted/10 p-4" aria-busy="true" aria-live="polite">
              <div className="flex items-center gap-3">
                <span
                  className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-primary/25 border-t-primary motion-reduce:animate-none"
                  aria-hidden
                />
                <p className="text-sm font-medium text-foreground">Fetching from YouTube…</p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted/50">
                <div className="ytpl-indeterminate-bar h-full w-2/5 rounded-full bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Large playlists load in pages — this can take up to a minute. You can leave the tab open.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {result?.ok ? (
        <>
          <section
            id="ytpl-results"
            aria-labelledby="ytpl-summary-heading"
            className="scroll-mt-24 space-y-6"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Results</p>
                <h2 id="ytpl-summary-heading" className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {result.playlistTitle || "Playlist"}
                </h2>
                <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                  <span>
                    Slots {result.rangeFrom}–{result.rangeTo} of {result.totalItemsInPlaylist}
                  </span>
                  <span className="hidden sm:inline" aria-hidden>
                    ·
                  </span>
                  <span>{totals.count} videos in totals</span>
                  {fromCache ? (
                    <>
                      <span className="hidden sm:inline" aria-hidden>
                        ·
                      </span>
                      <span className="rounded-md bg-accent-muted px-1.5 py-0.5 text-[0.65rem] font-medium text-accent-foreground">
                        Browser cache
                      </span>
                    </>
                  ) : null}
                  {result.cached ? (
                    <span className="rounded-md bg-primary-muted px-1.5 py-0.5 text-[0.65rem] font-medium text-foreground">
                      Server cache
                    </span>
                  ) : null}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={toggleCurrentPlaylistPin}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-sm transition hover:border-primary/35 hover:bg-muted/20 ${
                    currentPlaylistPinned
                      ? "border-primary/50 bg-primary-muted/60 text-foreground"
                      : "border-border bg-surface-elevated/50 text-foreground"
                  }`}
                >
                  {currentPlaylistPinned ? (
                    <IconStarFilled className="h-4 w-4 text-primary" />
                  ) : (
                    <IconStarOutline className="h-4 w-4 text-muted-foreground" />
                  )}
                  {currentPlaylistPinned ? "Unpin" : "Pin playlist"}
                </button>
                <button
                  type="button"
                  onClick={() => void copySummary()}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-elevated/50 px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:border-primary/35 hover:bg-muted/20"
                >
                  <IconCopy className="h-4 w-4 text-muted-foreground" />
                  {copyLabel}
                </button>
                <button
                  type="button"
                  onClick={() => void copyAllTitles()}
                  disabled={filteredVideos.length === 0}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-elevated/50 px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:border-primary/35 hover:bg-muted/20 disabled:pointer-events-none disabled:opacity-45"
                >
                  <IconCopy className="h-4 w-4 text-muted-foreground" />
                  {copyTitlesLabel}
                </button>
                <button
                  type="button"
                  onClick={shareLink}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-elevated/50 px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:border-primary/35 hover:bg-muted/20"
                >
                  <IconShare className="h-4 w-4 text-muted-foreground" />
                  {shareLabel}
                </button>
              </div>
            </div>

            {result.warnings.map((w) => (
              <div
                key={w}
                className="flex gap-3 rounded-xl border border-primary/30 bg-primary-muted/50 px-4 py-3 text-sm text-foreground"
              >
                <span className="text-primary" aria-hidden>
                  ●
                </span>
                <p className="leading-relaxed">{w}</p>
              </div>
            ))}

            <div className="grid gap-4 lg:grid-cols-12">
              <article className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary-muted/80 via-surface-elevated/90 to-surface p-6 shadow-sm lg:col-span-7">
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" aria-hidden />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total watch time</h3>
                <p className="mt-3 font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                  {formatDurationHuman(totals.seconds)}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  At <strong className="text-foreground">{speedMult}×</strong> speed:{" "}
                  <strong className="text-foreground">{formatDurationHuman(totals.seconds / speedMult)}</strong>
                </p>
              </article>
              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
                <article className="rounded-2xl border border-border/80 bg-surface p-5 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Videos counted</h3>
                  <p className="mt-2 font-display text-3xl font-bold tabular-nums text-foreground">{totals.count}</p>
                </article>
                <article className="rounded-2xl border border-border/80 bg-surface p-5 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Average length</h3>
                  <p className="mt-2 font-display text-xl font-bold text-foreground">{formatDurationHuman(totals.avg)}</p>
                </article>
              </div>
            </div>
          </section>

          <section aria-labelledby="ytpl-sort-heading" className="space-y-4">
            <div>
              <h2 id="ytpl-sort-heading" className="font-display text-lg font-semibold text-foreground">
                Sort videos
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Quick presets below, or click a column header in the table for a custom sort.
              </p>
            </div>
            <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
              {PRESETS.map((p) => {
                const active = listSort.kind === "preset" && listSort.preset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    title={p.title}
                    onClick={() => onPreset(p.id)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      active
                        ? "border-primary bg-primary/15 text-foreground shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="ytpl-table-title" className="overflow-hidden rounded-2xl border border-border/70 bg-surface-elevated/20 shadow-sm ring-1 ring-border/20">
            <div className="flex flex-col gap-3 border-b border-border/60 bg-muted/10 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:px-5">
              <div className="min-w-0 flex-1">
                <h2 id="ytpl-table-title" className="font-display text-base font-semibold text-foreground">
                  Video list
                </h2>
                <p className="text-xs text-muted-foreground">
                  Showing {filteredVideos.length} of {sortedVideos.length} rows
                  {tableFilter.trim() ? " (filtered)" : ""}. Copy all titles / CSV use this visible order.
                  <span className="hidden lg:inline" aria-hidden>
                    {" "}
                    · <kbd className="rounded border border-border px-0.5 font-mono">/</kbd> focuses filter
                  </span>
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:max-w-2xl sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  onClick={() => void copyAllTitles()}
                  disabled={filteredVideos.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-muted/20 disabled:pointer-events-none disabled:opacity-45"
                >
                  <IconCopy className="h-4 w-4 text-muted-foreground" />
                  {copyTitlesLabel}
                </button>
                <button
                  type="button"
                  onClick={exportCsv}
                  disabled={filteredVideos.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/40 hover:bg-muted/20 disabled:pointer-events-none disabled:opacity-45"
                >
                  <IconDownload className="h-4 w-4 text-muted-foreground" />
                  {csvLabel}
                </button>
                <label className="relative min-w-0 flex-1 sm:min-w-[12rem]">
                  <span className="sr-only">Filter by title</span>
                  <input
                    id="ytpl-table-filter"
                    type="search"
                    value={tableFilter}
                    onChange={(e) => setTableFilter(e.target.value)}
                    placeholder="Filter by title…"
                    autoComplete="off"
                    aria-label="Filter videos by title"
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-3 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
              </div>
            </div>
            <PlaylistLengthTable rows={filteredVideos} listSort={listSort} onColumnSort={onColumnSort} />
            {filteredVideos.length === 0 && sortedVideos.length > 0 ? (
              <p className="border-t border-border/60 px-5 py-6 text-center text-sm text-muted-foreground">
                No titles match “{tableFilter.trim()}”. Clear the filter to see all videos.
              </p>
            ) : null}
          </section>
        </>
      ) : null}

      <KeyboardShortcutsDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}
