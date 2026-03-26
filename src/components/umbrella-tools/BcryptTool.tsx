"use client";

import { useState } from "react";
import bcrypt from "bcryptjs";
import { DevToolsSecurityNote } from "@/components/umbrella-tools/DevToolsSecurityNote";
import ToolHeader from "@/components/umbrella-tools/ToolHeader";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

const TOOL_SLUG = "bcrypt-hash";

export default function BcryptTool() {
  const [tab, setTab] = useState<"hash" | "compare">("hash");
  const [password, setPassword] = useState("");
  const [rounds, setRounds] = useState(10);
  const [hashOut, setHashOut] = useState("");
  const [compareHash, setCompareHash] = useState("");
  const [comparePassword, setComparePassword] = useState("");
  const [compareResult, setCompareResult] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const meta = getDevToolBySlug(TOOL_SLUG);

  function doHash() {
    setBusy(true);
    setHashOut("");
    try {
      const r = Math.min(15, Math.max(4, rounds));
      const h = bcrypt.hashSync(password, r);
      setHashOut(h);
    } finally {
      setBusy(false);
    }
  }

  function doCompare() {
    setBusy(true);
    setCompareResult(null);
    try {
      const ok = bcrypt.compareSync(comparePassword, compareHash.trim());
      setCompareResult(ok);
    } catch {
      setCompareResult(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <ToolHeader
        title="Bcrypt hash & compare"
        description="Hash passwords with bcrypt or verify plaintext against a bcrypt hash. Runs entirely in your browser with bcryptjs."
        category={meta?.category}
      />
      <DevToolsSecurityNote lead="Passwords and hashes stay in this browser tab — they are not sent to our servers. " />
      <p className="mb-6 text-sm text-muted-foreground">
        Higher cost factors take longer and can briefly make this tab unresponsive while hashing; use lower values for quick tests.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("hash")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${
            tab === "hash" ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-foreground"
          }`}
        >
          Hash password
        </button>
        <button
          type="button"
          onClick={() => setTab("compare")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${
            tab === "compare" ? "bg-primary text-primary-foreground" : "border border-border bg-surface text-foreground"
          }`}
        >
          Compare
        </button>
      </div>

      {tab === "hash" ? (
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Cost factor (rounds): {Math.min(15, Math.max(4, rounds))}</label>
            <input
              type="range"
              min={4}
              max={15}
              value={Math.min(15, Math.max(4, rounds))}
              onChange={(e) => setRounds(parseInt(e.target.value, 10))}
              className="mt-2 w-full accent-primary"
            />
          </div>
          <button
            type="button"
            onClick={doHash}
            disabled={busy || !password}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
          >
            {busy ? "Hashing…" : "Generate hash"}
          </button>
          {hashOut ? (
            <pre className="overflow-x-auto break-all rounded-xl border border-border bg-surface p-4 font-mono text-xs text-foreground">{hashOut}</pre>
          ) : null}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Plaintext password</label>
            <input
              type="password"
              value={comparePassword}
              onChange={(e) => setComparePassword(e.target.value)}
              autoComplete="off"
              className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Bcrypt hash</label>
            <textarea
              value={compareHash}
              onChange={(e) => setCompareHash(e.target.value)}
              rows={4}
              placeholder="$2a$10$..."
              className="mt-2 w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="button"
            onClick={doCompare}
            disabled={busy || !comparePassword || !compareHash.trim()}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
          >
            {busy ? "Checking…" : "Compare"}
          </button>
          {compareResult !== null ? (
            <p className={`text-sm font-semibold ${compareResult ? "text-success" : "text-destructive"}`}>
              {compareResult ? "Match — password corresponds to this hash." : "No match — or invalid hash format."}
            </p>
          ) : null}
        </div>
      )}
    </>
  );
}
