"use client";

import { useState } from "react";
import { DevToolsSecurityNote } from "@/components/umbrella-tools/DevToolsSecurityNote";
import ToolHeader from "@/components/umbrella-tools/ToolHeader";
import type { HashAlgorithm } from "@/lib/umbrella-tools/hash";
import { digestText } from "@/lib/umbrella-tools/hash";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

const TOOL_SLUG = "hash-generator";

const ALGS: HashAlgorithm[] = ["SHA-256", "SHA-384", "SHA-512"];

export default function HashGeneratorTool() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [hash, setHash] = useState("");
  const [busy, setBusy] = useState(false);
  const meta = getDevToolBySlug(TOOL_SLUG);

  async function compute() {
    setBusy(true);
    setHash("");
    try {
      const h = await digestText(algorithm, input);
      setHash(h);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <ToolHeader
        title="SHA hash generator"
        description="Compute SHA-256, SHA-384, or SHA-512 hashes of arbitrary text using the Web Crypto API. Nothing is sent to a server."
        category={meta?.category}
      />
      <DevToolsSecurityNote lead="Your input and digest are computed only in this browser tab — no uploads. " />
      <div className="flex flex-wrap gap-3">
        {ALGS.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => {
              setAlgorithm(a);
              setHash("");
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              algorithm === a ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-foreground"
            }`}
          >
            {a}
          </button>
        ))}
      </div>
      <div className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-muted-foreground">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="button"
          onClick={compute}
          disabled={busy || !input}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
        >
          {busy ? "Computing…" : "Compute hash"}
        </button>
        {hash ? (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Hex digest</p>
            <pre className="mt-2 overflow-x-auto break-all rounded-xl border border-border bg-surface p-4 font-mono text-xs text-foreground">
              {hash}
            </pre>
          </div>
        ) : null}
      </div>
    </>
  );
}
