"use client";

import { useState } from "react";
import { DevToolPageShell } from "@/components/umbrella-tools/DevToolPageShell";

const TOOL_SLUG = "base64";

function utf8ToBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function base64ToUtf8(str: string): string {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    throw new Error("Invalid Base64 or not valid UTF-8 after decode.");
  }
}

export default function Base64Tool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  let output = "";
  let error: string | null = null;
  if (input.trim()) {
    try {
      output = mode === "encode" ? utf8ToBase64(input) : base64ToUtf8(input.trim());
    } catch (e) {
      error = e instanceof Error ? e.message : "Error";
    }
  }

  return (
    <DevToolPageShell slug={TOOL_SLUG}>
      
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
          <label className="text-sm font-medium text-muted-foreground">{mode === "encode" ? "Plain text" : "Base64"}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={14}
            className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">{mode === "encode" ? "Base64" : "Plain text"}</label>
          <textarea
            readOnly
            value={output}
            rows={14}
            className="w-full resize-y rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm text-foreground"
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
      </div>
    </DevToolPageShell>
  );
}
