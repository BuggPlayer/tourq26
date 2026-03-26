"use client";

import { useMemo, useState } from "react";
import beautify from "js-beautify";
import { marked } from "marked";
import TurndownService from "turndown";
import sanitizeHtml from "sanitize-html";
import ToolHeader from "@/components/umbrella-tools/ToolHeader";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

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
  const meta = getDevToolBySlug("html-formatter");
  const out = useMemo(() => {
    try {
      return beautify.html(input, { indent_size: 2, wrap_line_length: 120 });
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input]);
  return (
    <>
      <ToolHeader title="HTML formatter" description="Pretty-print HTML with js-beautify for readability." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={16} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={16} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </>
  );
}

export function HtmlMinifierTool() {
  const [input, setInput] = useState("<div>  <p> hi </p>  </div>");
  const meta = getDevToolBySlug("html-minifier");
  const out = useMemo(() => minifyHtmlBrowser(input), [input]);
  return (
    <>
      <ToolHeader
        title="HTML minifier"
        description="Collapse whitespace and strip HTML comments — browser-safe (no embedded CSS/JS minify)."
        category={meta?.category}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={16} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={16} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </>
  );
}

export function HtmlEncoderTool() {
  const [input, setInput] = useState("<div>");
  const meta = getDevToolBySlug("html-encoder");
  const out = useMemo(() => encodeNumericEntities(input), [input]);
  return (
    <>
      <ToolHeader title="HTML encoder" description="Encode characters to numeric HTML entities." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={12} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
      </div>
    </>
  );
}

export function HtmlDecoderTool() {
  const [input, setInput] = useState("&#60;div&#62;");
  const meta = getDevToolBySlug("html-decoder");
  const out = useMemo(() => unescapeHtmlEntities(input), [input]);
  return (
    <>
      <ToolHeader title="HTML decoder" description="Decode HTML entities back to characters." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={12} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </>
  );
}

export function HtmlEscapeTool() {
  const [input, setInput] = useState(`<a href="x">`);
  const meta = getDevToolBySlug("html-escape");
  const out = useMemo(() => escapeHtmlBasic(input), [input]);
  return (
    <>
      <ToolHeader title="HTML escape" description="Escape &, &lt;, &gt;, and quotes for safe embedding in HTML." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={12} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </>
  );
}

export function HtmlUnescapeTool() {
  const [input, setInput] = useState("&lt;div&gt;");
  const meta = getDevToolBySlug("html-unescape");
  const out = useMemo(() => unescapeHtmlEntities(input), [input]);
  return (
    <>
      <ToolHeader title="HTML unescape" description="Unescape common HTML entities." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={12} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </>
  );
}

export function HtmlValidatorTool() {
  const [input, setInput] = useState("<div><p>ok</p>");
  const meta = getDevToolBySlug("html-validator");
  const result = useMemo(() => {
    if (typeof document === "undefined") return { ok: true, msg: "" };
    const doc = new DOMParser().parseFromString(input, "text/html");
    const err = doc.querySelector("parsererror");
    if (err) return { ok: false, msg: err.textContent ?? "Parse error" };
    return { ok: true, msg: "Document parsed without parsererror (not a full W3C validation)." };
  }, [input]);
  return (
    <>
      <ToolHeader title="HTML validator" description="Well-formedness check via DOMParser — not a full W3C nu validator." category={meta?.category} />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <p className={`mt-4 text-sm font-medium ${result.ok ? "text-success" : "text-destructive"}`}>{result.msg}</p>
    </>
  );
}

export function HtmlStripperTool() {
  const [input, setInput] = useState("<p>Hello <b>world</b></p>");
  const meta = getDevToolBySlug("html-stripper");
  const out = useMemo(() => {
    if (typeof document === "undefined") return "";
    const doc = new DOMParser().parseFromString(input, "text/html");
    return doc.body.textContent ?? "";
  }, [input]);
  return (
    <>
      <ToolHeader title="HTML stripper" description="Remove tags and keep text (best-effort)." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={14} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </>
  );
}

export function MarkdownEditorTool() {
  const [input, setInput] = useState("# Hello\n\n**bold**");
  const meta = getDevToolBySlug("markdown-editor");
  const html = useMemo(() => {
    const raw = marked.parse(input, { async: false }) as string;
    return sanitizeHtml(raw);
  }, [input]);
  return (
    <>
      <ToolHeader title="Markdown editor" description="Edit Markdown with a live HTML preview (marked + sanitization)." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={18} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <div
          className="prose prose-invert max-w-none rounded-xl border border-border bg-surface/80 p-4 text-sm"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </>
  );
}

export function MarkdownToHtmlTool() {
  const [input, setInput] = useState("# Title");
  const meta = getDevToolBySlug("markdown-to-html");
  const out = useMemo(() => {
    const raw = marked.parse(input, { async: false }) as string;
    return sanitizeHtml(raw);
  }, [input]);
  return (
    <>
      <ToolHeader title="Markdown to HTML" description="Convert Markdown to sanitized HTML." category={meta?.category} />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <textarea readOnly value={out} rows={12} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
    </>
  );
}

export function HtmlToMarkdownTool() {
  const [input, setInput] = useState("<h1>Hi</h1><p>There</p>");
  const meta = getDevToolBySlug("html-to-markdown");
  const out = useMemo(() => {
    const td = new TurndownService({ headingStyle: "atx" });
    return td.turndown(input);
  }, [input]);
  return (
    <>
      <ToolHeader title="HTML to Markdown" description="Convert HTML to Markdown (Turndown)." category={meta?.category} />
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={14} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </>
  );
}
