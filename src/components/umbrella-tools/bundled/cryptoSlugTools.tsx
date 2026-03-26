"use client";

import { useMemo, useState } from "react";
import { DevToolsSecurityNote } from "@/components/umbrella-tools/DevToolsSecurityNote";
import { DevToolPageShell } from "@/components/umbrella-tools/DevToolPageShell";
import {
  type HashAlgorithmId,
  type HmacAlgorithmId,
  hashHexDigest,
  hmacHexDigest,
} from "@/lib/umbrella-tools/crypto-extended";

const HASH_SLUG_TO_ALG: Record<string, HashAlgorithmId> = {
  "md5-hash-generator": "MD5",
  "sha1-hash-generator": "SHA-1",
  "sha224-hash-generator": "SHA-224",
  "sha256-hash-generator": "SHA-256",
  "sha384-hash-generator": "SHA-384",
  "sha512-hash-generator": "SHA-512",
  "sha3-hash-generator": "SHA3-256",
  "ripemd160-hash-generator": "RIPEMD160",
};

const HMAC_SLUG_TO_ALG: Record<string, HmacAlgorithmId> = {
  "hmac-md5": "MD5",
  "hmac-sha1": "SHA-1",
  "hmac-sha224": "SHA-224",
  "hmac-sha256": "SHA-256",
  "hmac-sha384": "SHA-384",
  "hmac-sha512": "SHA-512",
  "hmac-sha3": "SHA3-256",
  "hmac-ripemd160": "RIPEMD160",
};

export function CryptoHashSlugTool({ slug }: { slug: string }) {
  const [input, setInput] = useState("");
  const alg = HASH_SLUG_TO_ALG[slug];
  const out = useMemo(() => {
    if (!alg) return "";
    try {
      return input ? hashHexDigest(alg, input) : "";
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [input, alg]);
  if (!alg) return null;
  return (
    <DevToolPageShell slug={slug}>
      <DevToolsSecurityNote lead="Computed locally with crypto-js — nothing is uploaded. " />
      <p className="mb-2 text-xs text-muted-foreground">Algorithm: {alg}</p>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={10} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <textarea readOnly value={out} rows={4} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
    </DevToolPageShell>
  );
}

export function CryptoHmacSlugTool({ slug }: { slug: string }) {
  const [secret, setSecret] = useState("");
  const [message, setMessage] = useState("");
  const alg = HMAC_SLUG_TO_ALG[slug];
  const out = useMemo(() => {
    if (!alg) return "";
    try {
      return secret || message ? hmacHexDigest(alg, secret, message) : "";
    } catch (e) {
      return e instanceof Error ? e.message : "Error";
    }
  }, [secret, message, alg]);
  if (!alg) return null;
  return (
    <DevToolPageShell slug={slug}>
      <DevToolsSecurityNote lead="HMAC is computed locally — keep production secrets out of shared machines. " />
      <p className="mb-2 text-xs text-muted-foreground">Algorithm: {alg}</p>
      <label className="text-sm text-muted-foreground">Secret key</label>
      <input
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        className="mt-1 w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm"
        autoComplete="off"
      />
      <label className="mt-4 block text-sm text-muted-foreground">Message</label>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={8} className="mt-1 w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <textarea readOnly value={out} rows={3} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
    </DevToolPageShell>
  );
}
