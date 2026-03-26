"use client";

import { useState } from "react";
import { DevToolPageShell } from "@/components/umbrella-tools/DevToolPageShell";
import { decodeJwtToken } from "@/lib/umbrella-tools/jwt";

const TOOL_SLUG = "jwt-decoder";

export default function JwtDecoderTool() {
  const [input, setInput] = useState("");

  const result = input.trim() ? decodeJwtToken(input) : null;
  const headerJson =
    result && !("error" in result) ? JSON.stringify(result.header, null, 2) : "";
  const payloadJson =
    result && !("error" in result) ? JSON.stringify(result.payload, null, 2) : "";

  return (
    <DevToolPageShell slug={TOOL_SLUG}>
      <p className="mb-4 rounded-lg border border-border/60 bg-surface/50 px-4 py-3 text-sm text-muted-foreground">
        Read-only debugging tool. Never paste production secrets into untrusted sites.
      </p>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">JWT</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 font-mono text-xs text-foreground break-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="space-y-4">
          {result && "error" in result ? (
            <p className="text-sm text-destructive">{result.error}</p>
          ) : null}
          {result && !("error" in result) ? (
            <>
              <div>
                <h2 className="text-sm font-medium text-muted-foreground">Header</h2>
                <pre className="mt-2 max-h-48 overflow-auto rounded-xl border border-border bg-surface p-4 font-mono text-xs text-foreground">
                  {headerJson}
                </pre>
              </div>
              <div>
                <h2 className="text-sm font-medium text-muted-foreground">Payload</h2>
                <pre className="mt-2 max-h-64 overflow-auto rounded-xl border border-border bg-surface p-4 font-mono text-xs text-foreground">
                  {payloadJson}
                </pre>
              </div>
              {result.signatureB64 ? (
                <p className="text-xs text-muted-foreground">
                  Signature (base64url): <span className="font-mono break-all">{result.signatureB64}</span>
                </p>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Paste a token to decode.</p>
          )}
        </div>
      </div>
    </DevToolPageShell>
  );
}
