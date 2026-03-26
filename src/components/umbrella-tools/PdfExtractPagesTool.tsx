"use client";

import { PDFDocument } from "pdf-lib";
import { useCallback, useState } from "react";
import { DevToolPageShell } from "@/components/umbrella-tools/DevToolPageShell";
import { parsePageRanges } from "@/lib/umbrella-tools/pdf-page-ranges";

const TOOL_SLUG = "pdf-extract-pages";

export default function PdfExtractPagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [range, setRange] = useState("1");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback(async (f: File | null) => {
    setFile(f);
    setPageCount(null);
    setError(null);
    if (!f) return;
    try {
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const n = doc.getPageCount();
      setPageCount(n);
      setRange(n <= 1 ? "1" : `1-${n}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid PDF file.");
      setFile(null);
    }
  }, []);

  const onPick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      void loadFile(f ?? null);
      e.target.value = "";
    },
    [loadFile],
  );

  const extract = useCallback(async () => {
    if (!file || pageCount === null) {
      setError("Choose a PDF first.");
      return;
    }
    const indices = parsePageRanges(range, pageCount);
    if (indices.length === 0) {
      setError(`Enter at least one valid page between 1 and ${pageCount} (e.g. 1-3, 5, 7-8).`);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, indices);
      copied.forEach((page) => out.addPage(page));
      const saved = await out.save();
      const blob = new Blob([new Uint8Array(saved)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const base = file.name.replace(/\.pdf$/i, "") || "document";
      a.download = `${base}-pages.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not extract pages.");
    } finally {
      setBusy(false);
    }
  }, [file, pageCount, range]);

  return (
    <DevToolPageShell slug={TOOL_SLUG}>
      <p className="text-sm text-muted-foreground">
        Upload one PDF, then list which pages to keep (1-based). Example: <code className="font-mono text-xs">1-3, 5, 8</code>.
        Processing stays in your browser.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-surface-elevated">
          Choose PDF
          <input type="file" accept="application/pdf,.pdf" className="sr-only" onChange={onPick} />
        </label>
        {file ? (
          <span className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{file.name}</span>
            {pageCount !== null ? ` · ${pageCount} page${pageCount === 1 ? "" : "s"}` : null}
          </span>
        ) : null}
      </div>
      {pageCount !== null ? (
        <div className="mt-6 space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Pages to include (1–{pageCount})
            <input
              type="text"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              placeholder="e.g. 1-3, 5, 7-10"
              className="mt-1 w-full max-w-md rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm text-foreground"
            />
          </label>
          <button
            type="button"
            onClick={() => void extract()}
            disabled={busy}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
          >
            {busy ? "Extracting…" : "Download new PDF"}
          </button>
        </div>
      ) : null}
      {error ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </DevToolPageShell>
  );
}
