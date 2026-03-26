"use client";

import { useState } from "react";
import ToolHeader from "@/components/umbrella-tools/ToolHeader";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

const TOOL_SLUG = "json-formatter";

export default function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const meta = getDevToolBySlug(TOOL_SLUG);

  function run(action: "format" | "minify" | "validate") {
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
  }

  return (
    <>
      <ToolHeader
        title="JSON formatter & validator"
        description="Paste JSON to format with indentation, minify to a single line, or validate syntax. Everything runs in your browser."
        category={meta?.category}
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => run("format")}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          Format
        </button>
        <button
          type="button"
          onClick={() => run("minify")}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-elevated"
        >
          Minify
        </button>
        <button
          type="button"
          onClick={() => run("validate")}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-elevated"
        >
          Validate
        </button>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={18}
            placeholder='{ "hello": "world" }'
            className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Output</label>
          <textarea
            readOnly
            value={output}
            rows={18}
            className="w-full resize-y rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm text-foreground"
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
      </div>
    </>
  );
}
