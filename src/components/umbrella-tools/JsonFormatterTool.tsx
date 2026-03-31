"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";
import {
  DEV_TOOL_PRIMARY_SURFACE_CLASS,
  DevToolPageShell,
} from "@/components/umbrella-tools/DevToolPageShell";
import { getDevToolsHrefForLocale } from "@/lib/dev-tools-locale-path";

const TOOL_SLUG = "json-formatter";

export default function JsonFormatterTool() {
  const { locale } = useDevToolsLocale();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const run = useCallback((action: "format" | "minify" | "validate") => {
    setError(null);
    const t = input.trim();
    if (!t) {
      setOutput("");
      setError("Paste JSON first.");
      return;
    }
    try {
      const parsed = JSON.parse(t) as unknown;
      if (action === "validate") {
        setOutput(JSON.stringify(parsed, null, 2));
        return;
      }
      if (action === "format") {
        setOutput(JSON.stringify(parsed, null, 2));
        return;
      }
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }, [input]);

  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setInput(typeof reader.result === "string" ? reader.result : "");
      setOutput("");
      setError(null);
    };
    reader.readAsText(f);
    e.target.value = "";
  }, []);

  const copyOutput = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* */
    }
  }, [output]);

  const downloadOutput = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [output]);

  return (
    <DevToolPageShell slug={TOOL_SLUG} showTryHeading={false}>
      <section className="min-w-0" aria-labelledby="json-try-heading">
        <h2
          id="json-try-heading"
          className="break-words font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl"
        >
          Try it
        </h2>
        <div className={`mt-4 sm:mt-6 ${DEV_TOOL_PRIMARY_SURFACE_CLASS}`}>
          <p className="max-w-2xl text-foreground/90">
            Paste JSON below, or load a <code className="font-mono text-[0.85em]">.json</code> /{" "}
            <code className="font-mono text-[0.85em]">.txt</code> file from your device. Then use Format, Minify, or
            Validate.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
            <label className="flex min-h-11 cursor-pointer items-center rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-surface-elevated">
              <span className="sr-only">Upload a JSON or text file</span>
              <span aria-hidden>Upload file</span>
              <input type="file" accept=".json,.txt,application/json,text/plain" className="sr-only" onChange={onFile} />
            </label>
            <button
              type="button"
              onClick={() => run("format")}
              className="min-h-11 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
              aria-label="Format JSON with indentation"
            >
              Format
            </button>
            <button
              type="button"
              onClick={() => run("minify")}
              className="min-h-11 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-elevated"
              aria-label="Minify JSON to one line"
            >
              Minify
            </button>
            <button
              type="button"
              onClick={() => run("validate")}
              className="min-h-11 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-elevated"
              aria-label="Validate JSON and pretty-print output"
            >
              Validate
            </button>
          </div>

          <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-2">
          <div className="min-w-0 space-y-2">
            <label htmlFor="json-input" className="text-sm font-medium text-foreground/90">
              Input
            </label>
            <textarea
              id="json-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={18}
              placeholder='{ "hello": "world" }'
              className="w-full min-w-0 resize-y rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="json-output" className="text-sm font-medium text-foreground/90">
                Output
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyOutput}
                  disabled={!output}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40 disabled:opacity-40"
                  aria-label={copied ? "Output copied to clipboard" : "Copy formatted JSON to clipboard"}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={downloadOutput}
                  disabled={!output}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40 disabled:opacity-40"
                  aria-label="Download output as formatted.json"
                >
                  Download
                </button>
              </div>
            </div>
            <textarea
              id="json-output"
              readOnly
              value={output}
              rows={18}
              className="w-full min-w-0 resize-y rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm text-foreground"
              aria-label="Formatted or minified JSON output"
            />
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <p role="status" aria-live="polite" className="sr-only">
              {copied ? "Output copied to clipboard." : ""}
            </p>
          </div>
        </div>
        </div>
      </section>

      <section className="mt-12 border-t border-border/50 pt-10" aria-labelledby="what-is-json-heading">
        <h2 id="what-is-json-heading" className="font-display text-lg font-semibold tracking-tight text-foreground">
          What is JSON?
        </h2>
        <div className="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed text-foreground/90">
          <p>
            JSON (JavaScript Object Notation) is a lightweight way to represent structured data as text. It is easy for
            both people and programs to read, and it maps cleanly to objects and arrays in most languages — not only
            JavaScript. Douglas Crockford popularized the format; today it is the default choice for REST APIs, config
            files, and browser–server data exchange.
          </p>
          <p>
            JSON uses double-quoted strings, commas, and explicit <code className="font-mono text-xs">{"{ }"}</code> and{" "}
            <code className="font-mono text-xs">[ ]</code> structures. For many web apps it has replaced XML for payloads
            because it is smaller and simpler to parse. When APIs send JSON, the HTTP{" "}
            <code className="rounded bg-surface-elevated px-1 py-0.5 font-mono text-xs">Content-Type</code> is usually{" "}
            <code className="rounded bg-surface-elevated px-1 py-0.5 font-mono text-xs">application/json</code>.
          </p>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="about-json-tool-heading">
        <h2 id="about-json-tool-heading" className="font-display text-lg font-semibold tracking-tight text-foreground">
          About this JSON formatter
        </h2>
        <div className="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed text-foreground/90">
          <p>
            This tool is built for developers who need to debug and read JSON quickly. APIs often return compact JSON
            without line breaks — hard to scan. Formatting adds consistent indentation so you can see nesting, keys, and
            values at a glance. Minify does the opposite: it removes extra whitespace when you need a small payload or a
            single line for logs.
          </p>
          <p>
            To validate and format, paste or upload your JSON, then click <strong className="text-foreground">Format</strong>,{" "}
            <strong className="text-foreground">Minify</strong>, or <strong className="text-foreground">Validate</strong>. The
            result appears in the output panel; you can copy it or download it as a file. For validation-only with a
            larger editor area, you can also use our{" "}
            <Link
              href={getDevToolsHrefForLocale("/dev-tools/json-validator-standalone", locale)}
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              standalone JSON validator
            </Link>
            .
          </p>
          <p>
            The tool is free, works in modern browsers (Chrome, Firefox, Safari, Edge), and runs on Windows, macOS, and
            Linux. Your JSON is processed in this tab — nothing is uploaded to our servers for formatting.
          </p>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="how-to-json-heading">
        <h2 id="how-to-json-heading" className="font-display text-lg font-semibold tracking-tight text-foreground">
          How to format JSON using this tool
        </h2>
        <ol className="mt-4 max-w-3xl list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90">
          <li>Type or paste your JSON into the input editor, or use Upload file to load a .json or .txt file.</li>
          <li>Click <strong className="text-foreground">Format</strong> for indented output, <strong className="text-foreground">Minify</strong> for a single line, or <strong className="text-foreground">Validate</strong> to parse and pretty-print.</li>
          <li>If the JSON is invalid, an error message explains what went wrong (for example an unexpected comma or quote).</li>
          <li>Use <strong className="text-foreground">Copy</strong> or <strong className="text-foreground">Download</strong> to take the result into your project or file.</li>
        </ol>
      </section>

      <section className="mt-10" aria-labelledby="json-features-heading">
        <h2 id="json-features-heading" className="font-display text-lg font-semibold tracking-tight text-foreground">
          Features of this tool
        </h2>
        <div className="mt-6 space-y-8 max-w-3xl">
          <div>
            <h3 className="text-base font-semibold text-foreground">Editing &amp; formatting</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              Paste or upload JSON, then format with 2-space indentation or minify to compact text. All processing happens
              in your browser as you click the actions.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Fast feedback</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              You get formatted or minified output in moments — no queue and no server round-trip for the transform
              itself.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Safe and secure</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              Your JSON is not stored in a database for this feature: parsing and stringifying run locally in your
              browser tab.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Validates JSON</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              Invalid JSON surfaces a clear parse error so you can fix brackets, quotes, or commas. Valid input is
              normalized in the output panel.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Ways to load JSON</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              Besides typing and pasting, use <strong className="text-foreground">Upload file</strong> to read a .json or
              .txt file from your machine into the editor.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Indentation &amp; minify</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              Format expands structure for readability; Minify strips whitespace to reduce size. Both start from the same
              parsed tree so the data stays equivalent.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Copy &amp; download</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              Copy the output to the clipboard in one click, or download it as <code className="font-mono text-xs">formatted.json</code>.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Works in your browser</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              No install required — open the page and use it. You only need a recent browser and an internet connection
              to load the site.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Free, no sign-up</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              There is no account or registration step to use this formatter.
            </p>
          </div>
        </div>
      </section>
    </DevToolPageShell>
  );
}
