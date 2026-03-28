"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ThemeControls } from "@/components/theme/ThemeControls";

function PlayMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}

export function YouTubeToolHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const sheetId = useId();

  const close = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, close]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-3 sm:px-5 lg:px-6">
          <Link
            href="/youtube-playlist-length"
            className="flex min-h-11 min-w-0 items-center gap-2 sm:gap-2.5 text-foreground no-underline outline-none transition-opacity active:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground sm:h-8 sm:w-8"
              aria-hidden
            >
              <PlayMark />
            </span>
            <span className="truncate text-sm font-bold tracking-tight sm:text-base">
              <span className="sm:hidden">Playlist</span>
              <span className="hidden sm:inline">Playlist length</span>
            </span>
          </Link>

          <div className="hidden shrink-0 items-center gap-4 md:flex">
            <nav aria-label="Tool navigation">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Home
              </Link>
            </nav>
            <ThemeControls />
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground transition active:bg-muted/30 md:hidden"
            aria-expanded={menuOpen}
            aria-controls={sheetId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 md:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            aria-label="Dismiss menu"
            onClick={close}
          />
          <div
            id={sheetId}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-x-0 bottom-0 max-h-[min(92vh,32rem)] overflow-y-auto rounded-t-2xl border border-border/80 bg-background shadow-2xl ring-1 ring-border/30"
            style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-border/60 bg-background px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Menu</p>
              <button
                ref={closeBtnRef}
                type="button"
                className="inline-flex h-11 min-w-11 items-center justify-center rounded-lg border border-border px-3 text-sm font-medium text-foreground"
                onClick={close}
              >
                <IconClose className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="space-y-1 px-4 py-4">
              <Link
                href="/"
                className="flex min-h-12 items-center rounded-xl px-3 text-base font-medium text-foreground transition active:bg-muted/40"
                onClick={close}
              >
                Home
              </Link>
              <div className="border-t border-border/60 pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Appearance</p>
                <ThemeControls layout="stacked" />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
