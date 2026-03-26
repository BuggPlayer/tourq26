"use client";

import { useState } from "react";
import bcrypt from "bcryptjs";
import { DevToolsSecurityNote } from "@/components/umbrella-tools/DevToolsSecurityNote";
import ToolHeader from "@/components/umbrella-tools/ToolHeader";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

export function BcryptGeneratorOnlyTool() {
  const [password, setPassword] = useState("");
  const [rounds, setRounds] = useState(10);
  const [hashOut, setHashOut] = useState("");
  const [busy, setBusy] = useState(false);
  const meta = getDevToolBySlug("bcrypt-generator");

  function doHash() {
    setBusy(true);
    setHashOut("");
    try {
      const r = Math.min(15, Math.max(4, rounds));
      setHashOut(bcrypt.hashSync(password, r));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <ToolHeader title="Bcrypt generator" description="Generate bcrypt hashes with configurable cost." category={meta?.category} />
      <DevToolsSecurityNote lead="Passwords and hashes stay in this browser tab. " />
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Cost factor: {Math.min(15, Math.max(4, rounds))}</label>
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
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Hashing…" : "Generate hash"}
        </button>
        {hashOut ? <pre className="overflow-x-auto break-all rounded-xl border border-border bg-surface p-4 font-mono text-xs">{hashOut}</pre> : null}
      </div>
    </>
  );
}

export function BcryptCheckerOnlyTool() {
  const [compareHash, setCompareHash] = useState("");
  const [comparePassword, setComparePassword] = useState("");
  const [compareResult, setCompareResult] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const meta = getDevToolBySlug("bcrypt-checker");

  function doCompare() {
    setBusy(true);
    setCompareResult(null);
    try {
      setCompareResult(bcrypt.compareSync(comparePassword, compareHash.trim()));
    } catch {
      setCompareResult(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <ToolHeader title="Bcrypt checker" description="Verify a password against a bcrypt hash." category={meta?.category} />
      <DevToolsSecurityNote lead="Passwords and hashes stay in this browser tab. " />
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Plaintext password</label>
          <input
            type="password"
            value={comparePassword}
            onChange={(e) => setComparePassword(e.target.value)}
            autoComplete="off"
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Bcrypt hash</label>
          <textarea
            value={compareHash}
            onChange={(e) => setCompareHash(e.target.value)}
            rows={4}
            placeholder="$2a$10$..."
            className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm"
          />
        </div>
        <button
          type="button"
          onClick={doCompare}
          disabled={busy || !comparePassword || !compareHash.trim()}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Checking…" : "Compare"}
        </button>
        {compareResult !== null ? (
          <p className={`text-sm font-semibold ${compareResult ? "text-success" : "text-destructive"}`}>
            {compareResult ? "Match." : "No match or invalid hash."}
          </p>
        ) : null}
      </div>
    </>
  );
}
