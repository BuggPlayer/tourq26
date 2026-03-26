"use client";

import { useCallback, useId, useState } from "react";
import ToolHeader from "@/components/umbrella-tools/ToolHeader";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

const TOOL_SLUG = "random-string";

const CHARSETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}|;:,.<>?",
} as const;

function randomFromCharset(length: number, charset: string): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += charset[bytes[i]! % charset.length]!;
  }
  return out;
}

export default function RandomStringTool() {
  const id = useId();
  const [length, setLength] = useState(32);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [output, setOutput] = useState("");
  const [copyHint, setCopyHint] = useState<string | null>(null);
  const meta = getDevToolBySlug(TOOL_SLUG);

  const generate = useCallback(() => {
    let charset = "";
    if (useLower) charset += CHARSETS.lower;
    if (useUpper) charset += CHARSETS.upper;
    if (useDigits) charset += CHARSETS.digits;
    if (useSymbols) charset += CHARSETS.symbols;
    if (!charset) {
      setCopyHint("Select at least one character set.");
      return;
    }
    const len = Math.min(4096, Math.max(1, length));
    setCopyHint(null);
    setOutput(randomFromCharset(len, charset));
  }, [length, useDigits, useLower, useSymbols, useUpper]);

  async function copy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopyHint("Copied to clipboard.");
    } catch {
      setCopyHint("Could not copy.");
    }
  }

  return (
    <>
      <ToolHeader
        title="Random string generator"
        description="Uses crypto.getRandomValues for unpredictable output. Pick length and character sets, then generate and copy."
        category={meta?.category}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label htmlFor={`${id}-len`} className="text-sm font-medium text-muted-foreground">
              Length ({Math.min(4096, Math.max(1, length))})
            </label>
            <input
              id={`${id}-len`}
              type="range"
              min={1}
              max={256}
              value={Math.min(length, 256)}
              onChange={(e) => setLength(parseInt(e.target.value, 10))}
              className="mt-2 w-full accent-primary"
            />
            <input
              type="number"
              min={1}
              max={4096}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value, 10) || 1)}
              className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm"
            />
          </div>
          <fieldset>
            <legend className="text-sm font-medium text-muted-foreground">Character sets</legend>
            <div className="mt-2 flex flex-col gap-2">
              {(
                [
                  ["lowercase", useLower, setUseLower] as const,
                  ["uppercase", useUpper, setUseUpper] as const,
                  ["digits", useDigits, setUseDigits] as const,
                  ["symbols", useSymbols, setUseSymbols] as const,
                ]
              ).map(([label, checked, set]) => (
                <label key={label} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="checkbox" checked={checked} onChange={(e) => set(e.target.checked)} className="accent-primary" />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <button
            type="button"
            onClick={generate}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            Generate
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-muted-foreground">Output</span>
            <button
              type="button"
              onClick={copy}
              disabled={!output}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:border-primary/40 disabled:opacity-40"
            >
              Copy
            </button>
            {copyHint ? <span className="text-xs text-muted-foreground">{copyHint}</span> : null}
          </div>
          <textarea
            readOnly
            value={output}
            rows={12}
            placeholder="Click Generate…"
            className="w-full resize-y rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm text-foreground"
          />
        </div>
      </div>
    </>
  );
}
