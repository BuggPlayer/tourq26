"use client";

import type { PlaylistVideoRow } from "@/lib/youtube-playlist/types";
import { formatCount, formatDurationClock } from "@/lib/youtube-playlist/format-duration";
import type { ColumnSortKey, ListSortState } from "./sort-videos";

type Props = {
  rows: PlaylistVideoRow[];
  listSort: ListSortState;
  onColumnSort: (key: ColumnSortKey) => void;
  className?: string;
};

function headerAriaSort(
  listSort: ListSortState,
  key: ColumnSortKey,
): "ascending" | "descending" | "none" {
  if (listSort.kind !== "column") return "none";
  if (listSort.key !== key) return "none";
  return listSort.dir === "asc" ? "ascending" : "descending";
}

function SortHint({ listSort, col }: { listSort: ListSortState; col: ColumnSortKey }) {
  if (listSort.kind !== "column" || listSort.key !== col) {
    return <span className="text-muted-foreground/40">·</span>;
  }
  return (
    <span className="text-primary" aria-hidden>
      {listSort.dir === "asc" ? "↑" : "↓"}
    </span>
  );
}

const sortHeaderBtnClass =
  "inline-flex min-h-10 items-center gap-1.5 rounded-md px-2 py-1.5 -mx-1 font-semibold text-muted-foreground transition hover:bg-muted/40 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-0 sm:px-1 sm:py-0.5";

function IconExternal({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlaylistLengthTable({ rows, listSort, onColumnSort, className = "" }: Props) {
  return (
    <div
      className={`overflow-x-auto overscroll-x-contain touch-pan-x [-webkit-overflow-scrolling:touch] ${className}`}
    >
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <caption className="sr-only">Videos in the selected playlist range with duration and statistics</caption>
        <thead>
          <tr className="border-b border-border/80 bg-muted/15 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <th scope="col" className="px-3 py-3.5 sm:px-4" aria-sort={headerAriaSort(listSort, "position")}>
              <button
                type="button"
                className={sortHeaderBtnClass}
                onClick={() => onColumnSort("position")}
              >
                # <SortHint listSort={listSort} col="position" />
              </button>
            </th>
            <th scope="col" className="px-3 py-3.5 sm:px-4" aria-sort={headerAriaSort(listSort, "title")}>
              <button
                type="button"
                className={sortHeaderBtnClass}
                onClick={() => onColumnSort("title")}
              >
                Title <SortHint listSort={listSort} col="title" />
              </button>
            </th>
            <th scope="col" className="px-3 py-3.5 sm:px-4" aria-sort={headerAriaSort(listSort, "duration")}>
              <button
                type="button"
                className={sortHeaderBtnClass}
                onClick={() => onColumnSort("duration")}
              >
                Duration <SortHint listSort={listSort} col="duration" />
              </button>
            </th>
            <th scope="col" className="px-3 py-3.5 sm:px-4" aria-sort={headerAriaSort(listSort, "views")}>
              <button
                type="button"
                className={sortHeaderBtnClass}
                onClick={() => onColumnSort("views")}
              >
                Views <SortHint listSort={listSort} col="views" />
              </button>
            </th>
            <th scope="col" className="px-3 py-3.5 sm:px-4" aria-sort={headerAriaSort(listSort, "likes")}>
              <button
                type="button"
                className={sortHeaderBtnClass}
                onClick={() => onColumnSort("likes")}
              >
                Likes <SortHint listSort={listSort} col="likes" />
              </button>
            </th>
            <th scope="col" className="px-3 py-3.5 sm:px-4" aria-sort={headerAriaSort(listSort, "comments")}>
              <button
                type="button"
                className={sortHeaderBtnClass}
                onClick={() => onColumnSort("comments")}
              >
                Comments <SortHint listSort={listSort} col="comments" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((v, i) => (
            <tr
              key={`${v.playlistIndex}-${v.videoId}`}
              className={`border-b border-border/50 transition-colors hover:bg-primary/[0.04] ${
                i % 2 === 1 ? "bg-muted/[0.06]" : ""
              }`}
            >
              <td className="whitespace-nowrap px-3 py-3 text-muted-foreground tabular-nums sm:px-4">
                {v.playlistIndex}
              </td>
              <td className="max-w-[min(28rem,55vw)] px-3 py-3 sm:px-4">
                <a
                  href={v.watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-2 font-medium text-foreground transition hover:text-primary"
                >
                  <span className="min-w-0 flex-1 leading-snug underline decoration-border underline-offset-2 group-hover:decoration-primary">
                    {v.title}
                  </span>
                  <IconExternal className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-60 group-hover:opacity-100" />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </td>
              <td className="whitespace-nowrap px-3 py-3 font-mono text-xs tabular-nums text-muted-foreground sm:px-4 sm:text-sm">
                {formatDurationClock(v.durationSeconds)}
              </td>
              <td className="whitespace-nowrap px-3 py-3 tabular-nums text-foreground/90 sm:px-4">{formatCount(v.views)}</td>
              <td className="whitespace-nowrap px-3 py-3 tabular-nums text-foreground/90 sm:px-4">{formatCount(v.likes)}</td>
              <td className="whitespace-nowrap px-3 py-3 tabular-nums text-foreground/90 sm:px-4">{formatCount(v.comments)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
