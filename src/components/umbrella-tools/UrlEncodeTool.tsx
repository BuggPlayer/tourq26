"use client";

import { useState } from "react";
import ToolHeader from "@/components/umbrella-tools/ToolHeader";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

const TOOL_SLUG = "url-encode";

export default function UrlEncodeTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const meta = getDevToolBySlug(TOOL_SLUG);

  let output = "";
  let error: string | null = null;
  if (input) {
    try {
      output = mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
    } catch (e) {
      error = e instanceof Error ? e.message : "Invalid input for decode.";
    }
  }

  return (
    <>
      <ToolHeader
        title="URL encode / decode"
        description="Use encodeURIComponent / decodeURIComponent for query strings and path segments. For full URLs, encode only the parts that need escaping."
        category={meta?.category}
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("encode")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${
            mode === "encode" ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-foreground"
          }`}
        >
          Encode
        </button>
        <button
          type="button"
          onClick={() => setMode("decode")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${
            mode === "decode" ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-foreground"
          }`}
        >
          Decode
        </button>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={12}
            placeholder={mode === "encode" ? "hello world & co." : "hello%20world%20%26%20co."}
            className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Output</label>
          <textarea
            readOnly
            value={output}
            rows={12}
            className="w-full resize-y rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm text-foreground"
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
      </div>
    </>
  );
}
