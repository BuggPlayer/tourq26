"use client";

import { useMemo, useState } from "react";
import ToolHeader from "@/components/umbrella-tools/ToolHeader";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

function wc(text: string) {
  const lines = text.split(/\r\n|\r|\n/);
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
  const chars = [...text].length;
  return { lines: lines.length, words: words.length, chars };
}

export function WordCounterTool() {
  const [input, setInput] = useState("");
  const meta = getDevToolBySlug("word-counter");
  const stats = useMemo(() => wc(input), [input]);
  return (
    <>
      <ToolHeader title="Word counter" description="Unicode-aware counts for words, characters, and lines." category={meta?.category} />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={14}
        className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm"
      />
      <dl className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-surface/80 p-4">
          <dt className="text-xs font-semibold uppercase text-muted-foreground">Words</dt>
          <dd className="font-display text-2xl font-bold">{stats.words}</dd>
        </div>
        <div className="rounded-xl border border-border/60 bg-surface/80 p-4">
          <dt className="text-xs font-semibold uppercase text-muted-foreground">Characters</dt>
          <dd className="font-display text-2xl font-bold">{stats.chars}</dd>
        </div>
        <div className="rounded-xl border border-border/60 bg-surface/80 p-4">
          <dt className="text-xs font-semibold uppercase text-muted-foreground">Lines</dt>
          <dd className="font-display text-2xl font-bold">{stats.lines}</dd>
        </div>
      </dl>
    </>
  );
}

function toCamel(s: string) {
  const p = s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  return p.map((w, i) => (i === 0 ? w : w[0]!.toUpperCase() + w.slice(1))).join("");
}
function toPascal(s: string) {
  return toCamel(s).replace(/^./, (c) => c.toUpperCase());
}
function toSnake(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}
function toConstant(s: string) {
  return toSnake(s).toUpperCase();
}
function toTrain(s: string) {
  return s
    .trim()
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase() + w.slice(1).toLowerCase())
    .join("-");
}

export function CaseConverterTool() {
  const [input, setInput] = useState("Hello World Example");
  const meta = getDevToolBySlug("case-converter");
  return (
    <>
      <ToolHeader title="Case converter" description="Transform letter case for titles, code, and constants." category={meta?.category} />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <div className="mt-4 flex flex-wrap gap-2">
        {(
          [
            ["lower", () => input.toLowerCase()],
            ["UPPER", () => input.toUpperCase()],
            ["camelCase", () => toCamel(input)],
            ["PascalCase", () => toPascal(input)],
            ["snake_case", () => toSnake(input)],
            ["CONSTANT_CASE", () => toConstant(input)],
            ["Train-Case", () => toTrain(input)],
          ] as const
        ).map(([label, fn]) => (
          <button
            key={label}
            type="button"
            onClick={() => setInput(fn())}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold hover:border-primary/40"
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}

export function LineSorterTool() {
  const [input, setInput] = useState("c\nb\na");
  const [numbered, setNumbered] = useState(false);
  const meta = getDevToolBySlug("line-sorter");
  function apply(mode: "sort" | "sort-ci" | "reverse" | "shuffle") {
    let lines = input.split(/\r\n|\r|\n/);
    if (mode === "sort") lines = [...lines].sort((a, b) => a.localeCompare(b));
    if (mode === "sort-ci") lines = [...lines].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    if (mode === "reverse") lines = lines.reverse();
    if (mode === "shuffle") {
      lines = [...lines];
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j]!, lines[i]!];
      }
    }
    let out = lines.join("\n");
    if (numbered) out = lines.map((l, i) => `${i + 1}. ${l}`).join("\n");
    setInput(out);
  }
  return (
    <>
      <ToolHeader title="Line sorter" description="Sort, reverse, or shuffle lines; optional numbering." category={meta?.category} />
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => apply("sort")} className="rounded-lg border px-3 py-1.5 text-sm">
          Sort A→Z
        </button>
        <button type="button" onClick={() => apply("sort-ci")} className="rounded-lg border px-3 py-1.5 text-sm">
          Sort (case-insensitive)
        </button>
        <button type="button" onClick={() => apply("reverse")} className="rounded-lg border px-3 py-1.5 text-sm">
          Reverse
        </button>
        <button type="button" onClick={() => apply("shuffle")} className="rounded-lg border px-3 py-1.5 text-sm">
          Shuffle
        </button>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={numbered} onChange={(e) => setNumbered(e.target.checked)} />
          Number lines on sort
        </label>
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
    </>
  );
}

export function WhitespaceRemoverTool() {
  const [input, setInput] = useState("  a \n  b  ");
  const [mode, setMode] = useState<"trim-lines" | "collapse" | "strip-all">("trim-lines");
  const meta = getDevToolBySlug("whitespace-remover");
  const out = useMemo(() => {
    if (mode === "trim-lines") return input.split(/\r\n|\r|\n/).map((l) => l.trim()).join("\n");
    if (mode === "collapse") return input.replace(/[ \t]+/g, " ");
    return input.replace(/\s+/g, "");
  }, [input, mode]);
  return (
    <>
      <ToolHeader title="Whitespace remover" description="Trim each line, collapse spaces, or remove all whitespace." category={meta?.category} />
      <div className="mb-3 flex flex-wrap gap-2">
        {(
          [
            ["trim-lines", "Trim lines"],
            ["collapse", "Collapse spaces"],
            ["strip-all", "Strip all whitespace"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setMode(k)}
            className={`rounded-lg px-3 py-1.5 text-sm ${mode === k ? "bg-primary text-primary-foreground" : "border"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={12} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </>
  );
}

export function LoremIpsumTool() {
  const [paragraphs, setParagraphs] = useState(3);
  const meta = getDevToolBySlug("lorem-ipsum-generator");
  const text = useMemo(() => Array.from({ length: paragraphs }, () => LOREM).join("\n\n"), [paragraphs]);
  return (
    <>
      <ToolHeader title="Lorem ipsum generator" description="Classic placeholder paragraphs for layouts and mockups." category={meta?.category} />
      <label className="text-sm text-muted-foreground">Paragraphs: {paragraphs}</label>
      <input type="range" min={1} max={20} value={paragraphs} onChange={(e) => setParagraphs(+e.target.value)} className="mt-2 w-full accent-primary" />
      <textarea readOnly value={text} rows={12} className="mt-4 w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
    </>
  );
}

export function TextToHexTool() {
  const [input, setInput] = useState("Hi");
  const meta = getDevToolBySlug("text-to-hex");
  const out = useMemo(() => {
    const bytes = new TextEncoder().encode(input);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ");
  }, [input]);
  return (
    <>
      <ToolHeader title="Text to HEX" description="UTF-8 bytes as lowercase hex pairs, space-separated." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={10} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={10} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </>
  );
}

export function HexToTextTool() {
  const [input, setInput] = useState("48 69");
  const meta = getDevToolBySlug("hex-to-text");
  let out = "";
  let err: string | null = null;
  try {
    const hex = input.replace(/[^0-9a-fA-F]/g, "");
    if (hex.length % 2) throw new Error("Odd number of hex digits.");
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    out = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch (e) {
    err = e instanceof Error ? e.message : "Invalid hex";
  }
  return (
    <>
      <ToolHeader title="HEX to text" description="Decode hex (with or without spaces) to UTF-8 text." category={meta?.category} />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={10} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      {err ? <p className="mt-2 text-sm text-destructive">{err}</p> : null}
      <textarea readOnly value={out} rows={6} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
    </>
  );
}
