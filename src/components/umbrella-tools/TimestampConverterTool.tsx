"use client";

import { useMemo, useState } from "react";
import { DevToolPageShell } from "@/components/umbrella-tools/DevToolPageShell";

const TOOL_SLUG = "timestamp-converter";

function parseUnix(input: string): number | null {
  const t = input.trim();
  if (!t) return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  if (n > 1e15) return null;
  /* Values ≥ 1e12 are treated as epoch milliseconds (current ms ≈ 1.7e12). */
  if (n >= 1e12) return Math.floor(n / 1000);
  return Math.floor(n);
}

export default function TimestampConverterTool() {
  const [unixInput, setUnixInput] = useState("");
  const [isoInput, setIsoInput] = useState("");

  const fromUnix = useMemo(() => {
    const sec = parseUnix(unixInput);
    if (sec === null || unixInput.trim() === "") return null;
    const ms = sec * 1000;
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return null;
    return {
      isoLocal: d.toString(),
      isoUtc: d.toISOString(),
      locale: d.toLocaleString(undefined, { dateStyle: "full", timeStyle: "long" }),
    };
  }, [unixInput]);

  const fromIso = useMemo(() => {
    const t = isoInput.trim();
    if (!t) return null;
    const d = new Date(t);
    if (Number.isNaN(d.getTime())) return { error: "invalid" as const };
    const sec = Math.floor(d.getTime() / 1000);
    return {
      unixSec: sec,
      unixMs: d.getTime(),
      isoUtc: d.toISOString(),
    };
  }, [isoInput]);

  function setNow() {
    const s = Math.floor(Date.now() / 1000);
    setUnixInput(String(s));
    setIsoInput(new Date().toISOString());
  }

  return (
    <DevToolPageShell slug={TOOL_SLUG}>
      
      <div className="mb-6">
        <button
          type="button"
          onClick={setNow}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-elevated"
        >
          Use current time
        </button>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-surface/40 p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">From Unix</h2>
          <p className="mt-1 text-sm text-muted-foreground">Seconds since epoch, or milliseconds (values ≥ 1e12).</p>
          <label className="mt-4 block text-sm font-medium text-muted-foreground">Unix value</label>
          <input
            value={unixInput}
            onChange={(e) => setUnixInput(e.target.value)}
            placeholder="1710000000"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
          />
          {fromUnix ? (
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">UTC (ISO)</dt>
                <dd className="font-mono text-foreground">{fromUnix.isoUtc}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Local</dt>
                <dd className="text-foreground">{fromUnix.locale}</dd>
              </div>
            </dl>
          ) : unixInput.trim() ? (
            <p className="mt-4 text-sm text-destructive">Could not parse as Unix time.</p>
          ) : null}
        </div>
        <div className="rounded-xl border border-border/60 bg-surface/40 p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">From ISO / date string</h2>
          <p className="mt-1 text-sm text-muted-foreground">Paste ISO 8601 or a string Date can parse.</p>
          <label className="mt-4 block text-sm font-medium text-muted-foreground">Date string</label>
          <input
            value={isoInput}
            onChange={(e) => setIsoInput(e.target.value)}
            placeholder="2025-03-26T12:00:00.000Z"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
          />
          {fromIso && "error" in fromIso ? (
            <p className="mt-4 text-sm text-destructive">Invalid date.</p>
          ) : fromIso ? (
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Unix (seconds)</dt>
                <dd className="font-mono text-foreground">{fromIso.unixSec}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Unix (milliseconds)</dt>
                <dd className="font-mono text-foreground">{fromIso.unixMs}</dd>
              </div>
            </dl>
          ) : null}
        </div>
      </div>
    </DevToolPageShell>
  );
}
