"use client";

import { PDFDocument } from "pdf-lib";
import { useCallback, useState } from "react";
import { DevToolPageShell } from "@/components/umbrella-tools/DevToolPageShell";

const TOOL_SLUG = "pdf-merge";

export default function PdfMergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list?.length) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
    setError(null);
    e.target.value = "";
  }, []);

  const removeAt = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  }, []);

  const move = useCallback((index: number, dir: -1 | 1) => {
    setFiles((prev) => {
      const next = [...prev];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j]!, next[index]!];
      return next;
    });
  }, []);

  const merge = useCallback(async () => {
    if (files.length === 0) {
      setError("Add at least one PDF file.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const indices = src.getPageIndices();
        const copied = await merged.copyPages(src, indices);
        copied.forEach((page) => merged.addPage(page));
      }
      const out = await merged.save();
      const blob = new Blob([new Uint8Array(out)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not merge PDFs. Check that files are valid PDFs.");
    } finally {
      setBusy(false);
    }
  }, [files]);

  return (
    <DevToolPageShell slug={TOOL_SLUG}>
      <p className="text-sm text-muted-foreground">
        Select multiple PDFs; order is top to bottom. Merging runs entirely in your browser — files are not uploaded to
        our servers.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-surface-elevated">
          Add PDFs
          <input type="file" accept="application/pdf,.pdf" className="sr-only" multiple onChange={onPick} />
        </label>
        <button
          type="button"
          onClick={() => merge()}
          disabled={busy || files.length === 0}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
        >
          {busy ? "Merging…" : "Merge & download"}
        </button>
      </div>
      {files.length > 0 ? (
        <ol className="mt-6 space-y-2 rounded-xl border border-border/60 bg-surface/40 p-3 text-sm">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}-${f.size}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-background/50 px-3 py-2"
            >
              <span className="min-w-0 truncate font-medium text-foreground">{f.name}</span>
              <span className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted"
                  onClick={() => move(i, 1)}
                  disabled={i === files.length - 1}
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="rounded border border-border px-2 py-0.5 text-xs text-destructive hover:bg-destructive/10"
                  onClick={() => removeAt(i)}
                  aria-label="Remove file"
                >
                  Remove
                </button>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">No files yet — use Add PDFs to begin.</p>
      )}
      {error ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </DevToolPageShell>
  );
}
