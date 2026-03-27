"use client";

import { useEffect, useRef } from "react";

type Row = { keys: string; desc: string };

const ROWS: Row[] = [
  { keys: "/", desc: "Focus the video title filter (when results are shown)" },
  { keys: "Esc", desc: "Clear the title filter when the filter field is focused" },
  { keys: "Ctrl + Enter", desc: "Run Calculate while the playlist URL field is focused" },
  { keys: "⌘ + Enter", desc: "Same on Mac (playlist URL field focused)" },
  { keys: "?", desc: "Open this panel (Shift + /) when not typing in a field" },
  {
    keys: "Tools",
    desc: "Pin favorites, copy all visible titles, and export CSV from the results area — data stays in your browser only.",
  },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export function KeyboardShortcutsDialog({ open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onDialogClose = () => onClose();
    el.addEventListener("close", onDialogClose);
    return () => el.removeEventListener("close", onDialogClose);
  }, [onClose]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="fixed left-1/2 top-1/2 z-[100] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-surface-elevated p-0 text-foreground shadow-[var(--shadow-card)] backdrop:bg-background/70 backdrop:backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      <div className="border-b border-border/60 px-5 py-4">
        <h2 className="font-display text-lg font-semibold">Keyboard shortcuts</h2>
        <p className="mt-1 text-xs text-muted-foreground">Handy when you analyze playlists often.</p>
      </div>
      <ul className="max-h-[min(60vh,24rem)] space-y-0 overflow-y-auto px-2 py-3">
        {ROWS.map((row) => (
          <li
            key={row.keys}
            className="flex gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted/20"
          >
            <kbd className="shrink-0 rounded-md border border-border bg-muted/30 px-2 py-0.5 font-mono text-xs text-foreground">
              {row.keys}
            </kbd>
            <span className="text-muted-foreground">{row.desc}</span>
          </li>
        ))}
      </ul>
      <div className="border-t border-border/60 px-5 py-3">
        <button
          type="button"
          className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
          onClick={() => ref.current?.close()}
        >
          Got it
        </button>
      </div>
    </dialog>
  );
}
