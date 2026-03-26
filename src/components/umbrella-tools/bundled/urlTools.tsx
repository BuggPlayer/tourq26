"use client";

import { useMemo, useState } from "react";
import ToolHeader from "@/components/umbrella-tools/ToolHeader";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

export function UrlParserTool() {
  const [input, setInput] = useState("https://user:pass@example.com:8080/path?q=1#h");
  const meta = getDevToolBySlug("url-parser");
  const parsed = useMemo(() => {
    try {
      return new URL(input);
    } catch {
      return null;
    }
  }, [input]);
  return (
    <>
      <ToolHeader title="URL parser" description="Inspect scheme, host, port, path, query, and hash with the URL API." category={meta?.category} />
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm"
      />
      {parsed ? (
        <dl className="mt-6 grid gap-3 font-mono text-sm sm:grid-cols-2">
          {(
            [
              ["href", parsed.href],
              ["protocol", parsed.protocol],
              ["username", parsed.username],
              ["password", parsed.password],
              ["host", parsed.host],
              ["hostname", parsed.hostname],
              ["port", parsed.port],
              ["pathname", parsed.pathname],
              ["search", parsed.search],
              ["hash", parsed.hash],
              ["origin", parsed.origin],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="rounded-lg border border-border/60 bg-surface/80 p-3">
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className="mt-1 break-all">{v || "—"}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-4 text-sm text-destructive">Invalid URL — check the format.</p>
      )}
    </>
  );
}

export function UrlEncoderTool() {
  const [input, setInput] = useState("hello world & ?");
  const meta = getDevToolBySlug("url-encoder");
  const out = useMemo(() => {
    try {
      return encodeURIComponent(input);
    } catch {
      return "";
    }
  }, [input]);
  return (
    <>
      <ToolHeader title="URL encoder" description="Percent-encode text for safe use in URLs and query strings." category={meta?.category} />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <textarea readOnly value={out} rows={4} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
    </>
  );
}

export function UrlDecoderTool() {
  const [input, setInput] = useState("hello%20world");
  const meta = getDevToolBySlug("url-decoder");
  let out = "";
  let err: string | null = null;
  try {
    out = decodeURIComponent(input);
  } catch {
    err = "Invalid percent-encoding.";
  }
  return (
    <>
      <ToolHeader title="URL decoder" description="Decode percent-encoded strings to readable text." category={meta?.category} />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      {err ? <p className="mt-2 text-sm text-destructive">{err}</p> : null}
      <textarea readOnly value={out} rows={4} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
    </>
  );
}

export function SlugGeneratorTool() {
  const [input, setInput] = useState("Hello World — SEO Title!");
  const meta = getDevToolBySlug("slug-generator");
  const slug = useMemo(() => {
    return input
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, [input]);
  return (
    <>
      <ToolHeader title="Slug generator" description="SEO-friendly URL slugs from titles — lowercase, hyphenated." category={meta?.category} />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <p className="mt-4 font-mono text-lg font-semibold">{slug || "—"}</p>
    </>
  );
}
