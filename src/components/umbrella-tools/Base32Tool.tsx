"use client";

import { useState } from "react";
import ToolHeader from "@/components/umbrella-tools/ToolHeader";
import { decodeBase32, encodeBase32 } from "@/lib/umbrella-tools/base32";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

const TOOL_SLUG = "base32-encode-decode";

export default function Base32Tool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const meta = getDevToolBySlug(TOOL_SLUG);

  let output = "";
  let error: string | null = null;
  if (input.trim()) {
    try {
      if (mode === "encode") {
        const bytes = new TextEncoder().encode(input);
        output = encodeBase32(bytes);
      } else {
        const bytes = decodeBase32(input);
        output = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      }
    } catch (e) {
      error = e instanceof Error ? e.message : "Error";
    }
  }

  return (
    <>
      <ToolHeader
        title="Base32 encode / decode"
        description="RFC 4648 Base32 — common for secrets, OTP provisioning, and case-insensitive channels."
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
          <label className="text-sm font-medium text-muted-foreground">{mode === "encode" ? "Plain text" : "Base32"}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={14}
            className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">{mode === "encode" ? "Base32" : "Plain text"}</label>
          <textarea
            readOnly
            value={output}
            rows={14}
            className="w-full resize-y rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm text-foreground"
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
      </div>
    </>
  );
}
