"use client";

import { useEffect, useMemo, useState } from "react";
import beautify from "js-beautify";
import { minify as terserMinify } from "terser";
import { minifyCssBrowser } from "@/lib/umbrella-tools/css-minify-browser";
import ToolHeader from "@/components/umbrella-tools/ToolHeader";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

function cssBalanceHint(css: string): string {
  let depth = 0;
  for (const ch of css) {
    if (ch === "{") depth++;
    if (ch === "}") depth--;
    if (depth < 0) return "Unbalanced braces — extra closing `}`.";
  }
  if (depth !== 0) return "Unbalanced braces — missing closing `}`.";
  return "Brace count looks balanced (not a full W3C validation).";
}

export function CssBeautifierTool() {
  const [input, setInput] = useState(".a { color: red; }");
  const meta = getDevToolBySlug("css-beautifier");
  const out = useMemo(() => {
    try {
      return beautify.css(input, { indent_size: 2 });
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input]);
  return (
    <>
      <ToolHeader title="CSS beautifier" description="Pretty-print CSS stylesheets." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={16} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={16} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </>
  );
}

export function CssMinifierTool() {
  const [input, setInput] = useState(".a { color: red; }");
  const meta = getDevToolBySlug("css-minifier");
  const out = useMemo(() => {
    try {
      return minifyCssBrowser(input);
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input]);
  return (
    <>
      <ToolHeader title="CSS minifier" description="Browser-safe minify — strips comments and collapses whitespace." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={16} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={16} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </>
  );
}

export function CssValidatorTool() {
  const [input, setInput] = useState(".x { margin: 0 }");
  const meta = getDevToolBySlug("css-validator");
  const hint = useMemo(() => cssBalanceHint(input), [input]);
  return (
    <>
      <ToolHeader title="CSS validator" description="Basic brace balance — not full W3C CSS validation." category={meta?.category} />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={16} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <p className="mt-4 text-sm text-muted-foreground">{hint}</p>
    </>
  );
}

export function JsBeautifierTool() {
  const [input, setInput] = useState("function foo(){return 1}");
  const meta = getDevToolBySlug("js-beautifier");
  const out = useMemo(() => {
    try {
      return beautify.js(input, { indent_size: 2 });
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input]);
  return (
    <>
      <ToolHeader title="JavaScript beautifier" description="Pretty-print JavaScript with js-beautify." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={16} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={16} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </>
  );
}

export function JsMinifierTool() {
  const [input, setInput] = useState("function foo() { return 1; }");
  const [out, setOut] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const meta = getDevToolBySlug("js-minifier");
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await terserMinify(input, { format: { comments: false } });
        if (!cancelled) {
          setOut(r.code ?? "");
          setErr(null);
        }
      } catch (e) {
        if (!cancelled) {
          setErr(e instanceof Error ? e.message : "Minify failed");
          setOut("");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [input]);
  return (
    <>
      <ToolHeader title="JavaScript minifier" description="Minify JS with terser (invalid syntax will fail)." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={16} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <div>
          {err ? <p className="mb-2 text-sm text-destructive">{err}</p> : null}
          <textarea readOnly value={out} rows={16} className="w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
        </div>
      </div>
    </>
  );
}

export function JsEscapeTool() {
  const [input, setInput] = useState(`line1\n"quotes"`);
  const meta = getDevToolBySlug("js-escape");
  const out = useMemo(() => JSON.stringify(input).slice(1, -1), [input]);
  return (
    <>
      <ToolHeader title="JavaScript escape" description="Escape a string for use inside a JavaScript string literal." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={8} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </>
  );
}

export function JsUnescapeTool() {
  const [input, setInput] = useState(String.raw`line1\n\"quotes\"`);
  const meta = getDevToolBySlug("js-unescape");
  const { out, err } = useMemo(() => {
    try {
      const quoted = `"${input.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
      return { out: JSON.parse(quoted) as string, err: null as string | null };
    } catch (e) {
      return { out: "", err: e instanceof Error ? e.message : "Parse error" };
    }
  }, [input]);
  return (
    <>
      <ToolHeader title="JavaScript unescape" description="Unescape content as if inside a double-quoted JSON string." category={meta?.category} />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      {err ? <p className="mt-2 text-sm text-destructive">{err}</p> : null}
      <textarea readOnly value={out} rows={8} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
    </>
  );
}
