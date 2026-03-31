"use client";

import { useMemo, useState } from "react";
import {
  DEV_TOOL_PRIMARY_SURFACE_CLASS,
  DevToolPageShell,
} from "@/components/umbrella-tools/DevToolPageShell";

export function UrlParserTool() {
  const [input, setInput] = useState("https://user:pass@example.com:8080/path?q=1#h");
  const parsed = useMemo(() => {
    try {
      return new URL(input);
    } catch {
      return null;
    }
  }, [input]);
  return (
    <DevToolPageShell slug="url-parser">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm"
        aria-label="URL to parse"
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
    </DevToolPageShell>
  );
}

export function UrlEncoderTool() {
  const [input, setInput] = useState("hello world & ?");
  const out = useMemo(() => {
    try {
      return encodeURIComponent(input);
    } catch {
      return "";
    }
  }, [input]);
  return (
    <DevToolPageShell slug="url-encoder">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={8}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm"
        aria-label="Plain text to encode"
      />
      <textarea readOnly value={out} rows={4} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" aria-label="Percent-encoded output" />
    </DevToolPageShell>
  );
}

export function UrlDecoderTool() {
  const [input, setInput] = useState("hello%20world");
  let out = "";
  let err: string | null = null;
  try {
    out = decodeURIComponent(input);
  } catch {
    err = "Invalid percent-encoding.";
  }
  return (
    <DevToolPageShell slug="url-decoder">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={8}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm"
        aria-label="Percent-encoded text to decode"
      />
      {err ? <p className="mt-2 text-sm text-destructive">{err}</p> : null}
      <textarea readOnly value={out} rows={4} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" aria-label="Decoded plain text" />
    </DevToolPageShell>
  );
}

const SLUG_BEFORE_AFTER: [string, string][] = [
  ["My Awesome Post!!!", "my-awesome-post"],
  ["What is a URL Slug? (Guide)", "what-is-a-url-slug-guide"],
  ["SEO Tips 2025: The Ultimate Guide", "seo-tips-2025-ultimate-guide"],
  ["10% Off & Special Offers!", "10-off-special-offers"],
];

export function SlugGeneratorTool() {
  const [input, setInput] = useState("My Awesome Post!!!");
  const [copied, setCopied] = useState(false);
  const slug = useMemo(() => {
    return input
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, [input]);

  async function copySlug() {
    if (!slug) return;
    try {
      await navigator.clipboard.writeText(slug);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* */
    }
  }

  return (
    <DevToolPageShell slug="slug-generator" showTryHeading={false}>
      <section className="min-w-0" aria-labelledby="slug-try-heading">
        <h2
          id="slug-try-heading"
          className="break-words font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl"
        >
          Try it
        </h2>
        <div className={`mt-3 sm:mt-4 ${DEV_TOOL_PRIMARY_SURFACE_CLASS}`}>
          <p className="text-foreground/90">
            Paste a title or headline — we lowercase it, strip accents, replace spaces and punctuation with hyphens, and
            trim extra dashes. Everything runs in your browser.
          </p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            className="mt-4 w-full min-w-0 rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm"
            aria-label="Title or phrase to convert into a URL slug"
          />
          <div className="mt-4 flex min-w-0 flex-wrap items-center gap-3">
            <p
              className={`min-w-0 flex-1 break-all font-mono text-base font-semibold motion-safe:transition-colors motion-safe:duration-200 sm:text-lg ${
                copied ? "text-primary" : "text-foreground"
              }`}
              aria-live="polite"
            >
              {slug || "—"}
            </p>
            <button
              type="button"
              onClick={copySlug}
              disabled={!slug}
              aria-label={copied ? "Slug copied to clipboard" : "Copy generated slug to clipboard"}
              className="min-h-11 shrink-0 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:border-primary/50 disabled:opacity-50"
            >
              {copied ? "Copied" : "Copy slug"}
            </button>
          </div>
          <p role="status" aria-live="polite" className="sr-only">
            {copied ? "Slug copied to clipboard." : ""}
          </p>
        </div>
      </section>

      <section className="mt-10 border-t border-border/50 pt-10" aria-labelledby="slug-best-practices-heading">
        <h2 id="slug-best-practices-heading" className="font-display text-lg font-semibold tracking-tight text-foreground">
          Best practices
        </h2>
        <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-foreground/90">
          <li>
            <strong className="text-foreground">Keep it short</strong> — 3 to 5 words is ideal.
          </li>
          <li>
            <strong className="text-foreground">Use hyphens</strong> — Google recommends hyphens over underscores.
          </li>
          <li>
            <strong className="text-foreground">Include target keywords</strong> — helps both SEO and user clarity.
          </li>
          <li>
            <strong className="text-foreground">Avoid stop words</strong> — omit “a”, “an”, “the” when possible.
          </li>
          <li>
            <strong className="text-foreground">Make it readable</strong> — users should understand the page from the slug
            alone.
          </li>
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="slug-before-after-heading">
        <h2 id="slug-before-after-heading" className="font-display text-lg font-semibold tracking-tight text-foreground">
          Before / after examples
        </h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border/60 bg-surface/30">
          <table className="w-full min-w-[min(100%,28rem)] text-left text-sm">
            <caption className="sr-only">Example titles and resulting URL slugs</caption>
            <thead>
              <tr className="border-b border-border/60 bg-surface/80">
                <th scope="col" className="px-4 py-3 font-semibold text-foreground">
                  Before
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-foreground">
                  After
                </th>
              </tr>
            </thead>
            <tbody>
              {SLUG_BEFORE_AFTER.map(([before, after]) => (
                <tr key={before} className="border-b border-border/40 last:border-0">
                  <td className="max-w-[min(100%,20rem)] px-4 py-3 text-foreground/90">{before}</td>
                  <td className="px-4 py-3 font-mono text-primary">{after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DevToolPageShell>
  );
}
