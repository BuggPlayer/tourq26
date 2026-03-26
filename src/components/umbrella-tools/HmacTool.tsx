"use client";

import { useState } from "react";
import { DevToolsSecurityNote } from "@/components/umbrella-tools/DevToolsSecurityNote";
import ToolHeader from "@/components/umbrella-tools/ToolHeader";
import type { HmacAlgorithm } from "@/lib/umbrella-tools/hmac";
import { hmacHex } from "@/lib/umbrella-tools/hmac";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

const TOOL_SLUG = "hmac-generator";

const ALGS: HmacAlgorithm[] = ["SHA-256", "SHA-384", "SHA-512"];

export default function HmacTool() {
  const [secret, setSecret] = useState("");
  const [message, setMessage] = useState("");
  const [algorithm, setAlgorithm] = useState<HmacAlgorithm>("SHA-256");
  const [hex, setHex] = useState("");
  const [busy, setBusy] = useState(false);
  const meta = getDevToolBySlug(TOOL_SLUG);

  async function compute() {
    setBusy(true);
    setHex("");
    try {
      const h = await hmacHex(algorithm, secret, message);
      setHex(h);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <ToolHeader
        title="HMAC generator"
        description="Compute HMAC in hexadecimal using your secret key and message. Matches Web Crypto — use the same inputs as your server to debug signatures."
        category={meta?.category}
      />
      <DevToolsSecurityNote />
      <div className="flex flex-wrap gap-3">
        {ALGS.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => {
              setAlgorithm(a);
              setHex("");
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              algorithm === a ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-foreground"
            }`}
          >
            HMAC-{a}
          </button>
        ))}
      </div>
      <div className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Secret key</label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            autoComplete="off"
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="mt-2 w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="button"
          onClick={compute}
          disabled={busy || !secret || !message}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
        >
          {busy ? "Computing…" : "Compute HMAC"}
        </button>
        {hex ? (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Hex (lowercase)</p>
            <pre className="mt-2 overflow-x-auto break-all rounded-xl border border-border bg-surface p-4 font-mono text-xs text-foreground">{hex}</pre>
          </div>
        ) : null}
      </div>
    </>
  );
}
