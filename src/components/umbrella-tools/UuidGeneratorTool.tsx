"use client";

import { useCallback, useState } from "react";
import { DevToolPageShell } from "@/components/umbrella-tools/DevToolPageShell";

const TOOL_SLUG = "uuid-generator";

export default function UuidGeneratorTool() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | "all" | null>(null);

  const generate = useCallback(() => {
    const n = Math.min(50, Math.max(1, count));
    const next: string[] = [];
    for (let i = 0; i < n; i++) {
      next.push(crypto.randomUUID());
    }
    setUuids(next);
  }, [count]);

  async function copyOne(i: number) {
    await navigator.clipboard.writeText(uuids[i]);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  }

  async function copyAll() {
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopied("all");
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <DevToolPageShell slug={TOOL_SLUG}>
      
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="uuid-count" className="block text-sm font-medium text-muted-foreground">
            How many (1–50)
          </label>
          <input
            id="uuid-count"
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="mt-1 w-24 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
          />
        </div>
        <button
          type="button"
          onClick={generate}
          aria-label="Generate random UUIDs"
          className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          Generate
        </button>
        {uuids.length > 0 ? (
          <button
            type="button"
            onClick={copyAll}
            aria-label={copied === "all" ? "All UUIDs copied to clipboard" : "Copy all UUIDs to clipboard"}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-elevated"
          >
            {copied === "all" ? "Copied!" : "Copy all"}
          </button>
        ) : null}
      </div>
      <ul className="mt-8 space-y-2">
        {uuids.map((id, i) => (
          <li key={id} className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-surface/50 px-4 py-3 font-mono text-sm">
            <span className="min-w-0 flex-1 break-all text-foreground">{id}</span>
            <button
              type="button"
              onClick={() => copyOne(i)}
              aria-label={
                copied === i
                  ? `UUID ${i + 1} copied to clipboard`
                  : `Copy UUID ${i + 1} to clipboard`
              }
              className="shrink-0 rounded-md bg-primary/15 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/25"
            >
              {copied === i ? "Copied" : "Copy"}
            </button>
          </li>
        ))}
      </ul>
      <p role="status" aria-live="polite" className="sr-only">
        {copied === "all"
          ? "All UUIDs copied to clipboard."
          : typeof copied === "number"
            ? `UUID ${copied + 1} copied to clipboard.`
            : ""}
      </p>
    </DevToolPageShell>
  );
}
