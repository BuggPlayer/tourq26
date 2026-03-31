"use client";

import { useMemo, useState } from "react";
import beautify from "js-beautify";
import { marked } from "marked";
import TurndownService from "turndown";
import sanitizeHtml from "sanitize-html";
import { DevToolPageShell } from "@/components/umbrella-tools/DevToolPageShell";

function escapeHtmlBasic(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function minifyHtmlBrowser(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s+</g, "<")
    .replace(/>\s+/g, ">")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function unescapeHtmlEntities(s: string) {
  if (typeof document === "undefined") return s;
  const ta = document.createElement("textarea");
  ta.innerHTML = s;
  return ta.value;
}

function encodeNumericEntities(s: string) {
  return [...s].map((ch) => `&#${ch.codePointAt(0)!};`).join("");
}

export function HtmlFormatterTool() {
  const [input, setInput] = useState("<div><p>hi</p></div>");
  const out = useMemo(() => {
    try {
      return beautify.html(input, { indent_size: 2, wrap_line_length: 120 });
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input]);
  return (
    <DevToolPageShell slug="html-formatter">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={16} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={16} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </DevToolPageShell>
  );
}

export function HtmlMinifierTool() {
  const [input, setInput] = useState("<div>  <p> hi </p>  </div>");
  const out = useMemo(() => minifyHtmlBrowser(input), [input]);
  return (
    <DevToolPageShell slug="html-minifier">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={16} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={16} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </DevToolPageShell>
  );
}

export function HtmlEncoderTool() {
  const [input, setInput] = useState("<div>");
  const out = useMemo(() => encodeNumericEntities(input), [input]);
  return (
    <DevToolPageShell slug="html-encoder">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={12} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </DevToolPageShell>
  );
}

export function HtmlDecoderTool() {
  const [input, setInput] = useState("&#60;div&#62;");
  const out = useMemo(() => unescapeHtmlEntities(input), [input]);
  return (
    <DevToolPageShell slug="html-decoder">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={12} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </DevToolPageShell>
  );
}

export function HtmlEscapeTool() {
  const [input, setInput] = useState(`<a href="x">`);
  const out = useMemo(() => escapeHtmlBasic(input), [input]);
  return (
    <DevToolPageShell slug="html-escape">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={12} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </DevToolPageShell>
  );
}

export function HtmlUnescapeTool() {
  const [input, setInput] = useState("&lt;div&gt;");
  const out = useMemo(() => unescapeHtmlEntities(input), [input]);
  return (
    <DevToolPageShell slug="html-unescape">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={12} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </DevToolPageShell>
  );
}

export function HtmlValidatorTool() {
  const [input, setInput] = useState("<div><p>ok</p>");
  const result = useMemo(() => {
    if (typeof document === "undefined") return { ok: true, msg: "" };
    const doc = new DOMParser().parseFromString(input, "text/html");
    const err = doc.querySelector("parsererror");
    if (err) return { ok: false, msg: err.textContent ?? "Parse error" };
    return { ok: true, msg: "Document parsed without parsererror (not a full W3C validation)." };
  }, [input]);
  return (
    <DevToolPageShell slug="html-validator">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={8}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm"
      />
      <p className={`mt-4 text-sm font-medium ${result.ok ? "text-success" : "text-destructive"}`}>{result.msg}</p>
    </DevToolPageShell>
  );
}

export function HtmlStripperTool() {
  const [input, setInput] = useState("<p>Hello <b>world</b></p>");
  const out = useMemo(() => {
    if (typeof document === "undefined") return "";
    const doc = new DOMParser().parseFromString(input, "text/html");
    return doc.body.textContent ?? "";
  }, [input]);
  return (
    <DevToolPageShell slug="html-stripper">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={14} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </DevToolPageShell>
  );
}

export function MarkdownEditorTool() {
  const [input, setInput] = useState("# Hello\n\n**bold**");
  const html = useMemo(() => {
    const raw = marked.parse(input, { async: false }) as string;
    return sanitizeHtml(raw);
  }, [input]);
  return (
    <DevToolPageShell slug="markdown-editor">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={18} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <div
          className="prose prose-invert max-w-none rounded-xl border border-border bg-surface/80 p-4 text-sm"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </DevToolPageShell>
  );
}

export function MarkdownToHtmlTool() {
  const [input, setInput] = useState("# Title");
  const out = useMemo(() => {
    const raw = marked.parse(input, { async: false }) as string;
    return sanitizeHtml(raw);
  }, [input]);
  return (
    <DevToolPageShell slug="markdown-to-html">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <textarea readOnly value={out} rows={12} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
    </DevToolPageShell>
  );
}

export function HtmlToMarkdownTool() {
  const [input, setInput] = useState("<h1>Hi</h1><p>There</p>");
  const out = useMemo(() => {
    const td = new TurndownService({ headingStyle: "atx" });
    return td.turndown(input);
  }, [input]);
  return (
    <DevToolPageShell slug="html-to-markdown">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={14} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </DevToolPageShell>
  );
}
