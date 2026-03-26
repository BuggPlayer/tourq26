"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { DevToolsSecurityNote } from "@/components/umbrella-tools/DevToolsSecurityNote";
import { DevToolPageShell } from "@/components/umbrella-tools/DevToolPageShell";
import { base64UrlToUtf8, utf8ToBase64Url } from "@/lib/umbrella-tools/paste-url";

const TOOL_SLUG = "pastebin";
const STORAGE_KEY = "torq-devtools-pastebin";
const URL_WARN_LEN = 7500;

export default function PastebinTool() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [text, setText] = useState("");
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    const d = searchParams.get("d");
    queueMicrotask(() => {
      if (d) {
        try {
          setText(base64UrlToUtf8(d));
          setHint(null);
        } catch {
          setHint("Could not decode ?d= — check the link is complete.");
        }
        return;
      }
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setText(saved);
      } catch {
        /* private mode */
      }
    });
  }, [searchParams]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, text);
      } catch {
        /* quota */
      }
    }, 400);
    return () => clearTimeout(id);
  }, [text]);

  const buildShareUrl = useCallback(() => {
    const d = utf8ToBase64Url(text);
    return `${typeof window !== "undefined" ? window.location.origin : ""}${pathname}?d=${d}`;
  }, [text, pathname]);

  async function copyShareLink() {
    const url = buildShareUrl();
    if (url.length > URL_WARN_LEN) {
      setHint("This paste is too long for a reliable share URL. Copy the text or download a .txt file instead.");
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setHint("Share link copied.");
    } catch {
      setHint("Could not copy link.");
    }
  }

  async function copyPlainText() {
    try {
      await navigator.clipboard.writeText(text);
      setHint("Text copied.");
    } catch {
      setHint("Could not copy.");
    }
  }

  function downloadTxt() {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "paste.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function clearPad() {
    setText("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* */
    }
    setHint("Cleared.");
  }

  return (
    <DevToolPageShell slug={TOOL_SLUG}>
      
      <DevToolsSecurityNote lead="Anyone with the share link can read the paste (it lives in the URL). Do not use for secrets. " />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyShareLink}
          aria-label="Copy shareable link to clipboard"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          Copy share link
        </button>
        <button
          type="button"
          onClick={copyPlainText}
          aria-label="Copy paste text to clipboard"
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/40"
        >
          Copy text
        </button>
        <button
          type="button"
          onClick={downloadTxt}
          aria-label="Download paste as a text file"
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/40"
        >
          Download .txt
        </button>
        <button
          type="button"
          onClick={clearPad}
          aria-label="Clear paste pad"
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:border-destructive/40 hover:text-destructive"
        >
          Clear
        </button>
      </div>
      {hint ? (
        <p role="status" aria-live="polite" className="mt-3 text-sm text-foreground/85">
          {hint}
        </p>
      ) : null}
      <p className="mt-2 text-xs text-muted-foreground">
        Autosaves to this browser. Share links may hit browser length limits for very large pastes.
      </p>

      <label htmlFor="pastebin-body" className="mt-6 block text-sm font-medium text-muted-foreground">
        Content
      </label>
      <textarea
        id="pastebin-body"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={18}
        placeholder="Paste notes, logs, or anything plain text…"
        className="mt-2 w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        spellCheck={false}
      />
      <p className="mt-2 text-xs text-muted-foreground">{text.length} characters</p>
    </DevToolPageShell>
  );
}
