"use client";

import { useTheme } from "next-themes";
import { useEffect, useId, useMemo, useState } from "react";
import { useIsClient } from "@/hooks/use-is-client";

type FontFamily = "brand" | "system";

type ThemeControlsProps = {
  /** Stacked, full-width controls for mobile sheets / narrow toolbars */
  layout?: "inline" | "stacked";
  className?: string;
};

export function ThemeControls({ layout = "inline", className }: ThemeControlsProps = {}) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useIsClient();
  const fontFieldId = useId();

  const persistedFont = useMemo((): FontFamily => {
    if (!mounted) return "brand";
    try {
      const stored = localStorage.getItem("torq-font-family");
      return stored === "system" ? "system" : "brand";
    } catch {
      return "brand";
    }
  }, [mounted]);

  const [fontOverride, setFontOverride] = useState<FontFamily | null>(null);
  const fontFamily = fontOverride ?? persistedFont;

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dataset.fontFamily = fontFamily;
  }, [mounted, fontFamily]);

  const cycleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const onFontChange = (next: FontFamily) => {
    setFontOverride(next);
    try {
      localStorage.setItem("torq-font-family", next);
    } catch {
      /* quota / private mode */
    }
    document.documentElement.dataset.fontFamily = next;
  };

  if (!mounted) {
    return (
      <div
        className={
          layout === "stacked"
            ? "flex w-full flex-col gap-3"
            : "flex items-center gap-2"
        }
        aria-hidden
      >
        <div className={`rounded-lg bg-muted/30 ${layout === "stacked" ? "h-11 w-full" : "h-9 w-20"}`} />
        <div className={`rounded-lg bg-muted/30 ${layout === "stacked" ? "h-11 w-11" : "h-9 w-9"}`} />
      </div>
    );
  }

  const label = `Color theme: switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`;

  if (layout === "stacked") {
    return (
      <div className={`flex w-full flex-col gap-4 ${className ?? ""}`}>
        <div>
          <label htmlFor={fontFieldId} className="mb-2 block text-sm font-medium text-foreground">
            Font
          </label>
          <select
            id={fontFieldId}
            value={fontFamily}
            onChange={(e) => onFontChange(e.target.value as FontFamily)}
            className="min-h-12 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-base font-medium text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="brand">Brand fonts</option>
            <option value="system">System UI</option>
          </select>
        </div>
        <div>
          <span className="mb-2 block text-sm font-medium text-foreground">Theme</span>
          <button
            type="button"
            onClick={cycleTheme}
            title={label}
            aria-label={label}
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background text-foreground shadow-sm transition-colors active:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {resolvedTheme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center justify-end gap-2 ${className ?? ""}`}>
      <label className="sr-only" htmlFor={fontFieldId}>
        Font
      </label>
      <select
        id={fontFieldId}
        value={fontFamily}
        onChange={(e) => onFontChange(e.target.value as FontFamily)}
        className="rounded-lg border border-border bg-background/80 px-2 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="brand">Brand fonts</option>
        <option value="system">System UI</option>
      </select>
      <button
        type="button"
        onClick={cycleTheme}
        title={label}
        aria-label={label}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/80 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {resolvedTheme === "dark" ? (
          <SunIcon className="h-4 w-4" />
        ) : (
          <MoonIcon className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}
