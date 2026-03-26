"use client";

import { useMemo, useState } from "react";
import { DevToolPageShell } from "@/components/umbrella-tools/DevToolPageShell";
import { crc32, fletcher16 } from "@/lib/umbrella-tools/crc32";

const TOOL_SLUG = "checksum-calculator";

function hex8(n: number): string {
  return `0x${n.toString(16).toUpperCase().padStart(8, "0")}`;
}

export default function ChecksumCalculatorTool() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    const bytes = new TextEncoder().encode(input);
    const c = crc32(bytes);
    const f = fletcher16(bytes);
    return { bytes: bytes.length, crc32: c, fletcher: f };
  }, [input]);

  return (
    <DevToolPageShell slug={TOOL_SLUG}>
      
      <label className="block text-sm font-medium text-muted-foreground">Input (UTF-8)</label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={12}
        placeholder="Paste text or leave empty for CRC of empty buffer…"
        className="mt-2 w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <p className="mt-2 text-xs text-muted-foreground">{result.bytes} byte(s)</p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-surface/80 px-4 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">CRC-32 (IEEE)</dt>
          <dd className="mt-1 font-mono text-sm text-foreground">{hex8(result.crc32)}</dd>
          <dd className="mt-1 font-mono text-xs text-muted-foreground">{result.crc32} (unsigned)</dd>
        </div>
        <div className="rounded-xl border border-border/60 bg-surface/80 px-4 py-3">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Fletcher-16</dt>
          <dd className="mt-1 font-mono text-sm text-foreground">
            sum1={result.fletcher.sum1} · sum2={result.fletcher.sum2}
          </dd>
          <dd className="mt-1 font-mono text-xs text-muted-foreground">
            combined 0x{(result.fletcher.combined & 0xffff).toString(16).toUpperCase().padStart(4, "0")} (16-bit)
          </dd>
        </div>
      </dl>
    </DevToolPageShell>
  );
}
