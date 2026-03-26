"use client";

import { useMemo, useState } from "react";
import { DevToolPageShell } from "@/components/umbrella-tools/DevToolPageShell";
import { decodeBase32, encodeBase32 } from "@/lib/umbrella-tools/base32";
import { decodeBase58, encodeBase58 } from "@/lib/umbrella-tools/base58";

function utf8ToBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function base64ToUtf8(str: string): string {
  return decodeURIComponent(escape(atob(str.trim())));
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex: string): Uint8Array {
  const cleaned = hex.replace(/\s/g, "");
  if (cleaned.length % 2) throw new Error("Odd hex length.");
  const out = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(cleaned.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export function Base32EncoderTool() {
  const [input, setInput] = useState("hi");
  const out = useMemo(() => encodeBase32(new TextEncoder().encode(input)), [input]);
  return (
    <DevToolPageShell slug="base32-encoder">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={8} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </DevToolPageShell>
  );
}

export function Base32DecoderTool() {
  const [input, setInput] = useState("");
  let out = "";
  let err: string | null = null;
  try {
    if (input.trim()) out = new TextDecoder("utf-8", { fatal: true }).decode(decodeBase32(input));
  } catch (e) {
    err = e instanceof Error ? e.message : "Error";
  }
  return (
    <DevToolPageShell slug="base32-decoder">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      {err ? <p className="mt-2 text-sm text-destructive">{err}</p> : null}
      <textarea readOnly value={out} rows={8} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
    </DevToolPageShell>
  );
}

export function Base32ToHexTool() {
  const [input, setInput] = useState("");
  const out = useMemo(() => {
    try {
      return bytesToHex(decodeBase32(input));
    } catch {
      return "";
    }
  }, [input]);
  return (
    <DevToolPageShell slug="base32-to-hex">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <textarea readOnly value={out} rows={4} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
    </DevToolPageShell>
  );
}

export function HexToBase32Tool() {
  const [input, setInput] = useState("4869");
  const out = useMemo(() => {
    try {
      return encodeBase32(hexToBytes(input));
    } catch {
      return "";
    }
  }, [input]);
  return (
    <DevToolPageShell slug="hex-to-base32">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <textarea readOnly value={out} rows={4} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
    </DevToolPageShell>
  );
}

export function Base58EncoderTool() {
  const [input, setInput] = useState("hi");
  const out = useMemo(() => encodeBase58(new TextEncoder().encode(input)), [input]);
  return (
    <DevToolPageShell slug="base58-encoder">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={8} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </DevToolPageShell>
  );
}

export function Base58DecoderTool() {
  const [input, setInput] = useState("");
  let out = "";
  let err: string | null = null;
  try {
    if (input.trim()) out = new TextDecoder("utf-8", { fatal: true }).decode(decodeBase58(input.trim()));
  } catch (e) {
    err = e instanceof Error ? e.message : "Error";
  }
  return (
    <DevToolPageShell slug="base58-decoder">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      {err ? <p className="mt-2 text-sm text-destructive">{err}</p> : null}
      <textarea readOnly value={out} rows={8} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
    </DevToolPageShell>
  );
}

export function Base58ToHexTool() {
  const [input, setInput] = useState("");
  const out = useMemo(() => {
    try {
      return bytesToHex(decodeBase58(input.trim()));
    } catch {
      return "";
    }
  }, [input]);
  return (
    <DevToolPageShell slug="base58-to-hex">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <textarea readOnly value={out} rows={4} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
    </DevToolPageShell>
  );
}

export function HexToBase58Tool() {
  const [input, setInput] = useState("4869");
  const out = useMemo(() => {
    try {
      return encodeBase58(hexToBytes(input));
    } catch {
      return "";
    }
  }, [input]);
  return (
    <DevToolPageShell slug="hex-to-base58">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <textarea readOnly value={out} rows={4} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
    </DevToolPageShell>
  );
}

export function Base64EncoderTool() {
  const [input, setInput] = useState("hello");
  const out = useMemo(() => utf8ToBase64(input), [input]);
  return (
    <DevToolPageShell slug="base64-encoder">
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={10} className="rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
        <textarea readOnly value={out} rows={10} className="rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
      </div>
    </DevToolPageShell>
  );
}

export function Base64DecoderTool() {
  const [input, setInput] = useState("");
  let out = "";
  let err: string | null = null;
  try {
    if (input.trim()) out = base64ToUtf8(input);
  } catch (e) {
    err = e instanceof Error ? e.message : "Invalid Base64";
  }
  return (
    <DevToolPageShell slug="base64-decoder">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={10} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      {err ? <p className="mt-2 text-sm text-destructive">{err}</p> : null}
      <textarea readOnly value={out} rows={10} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
    </DevToolPageShell>
  );
}

export function Base64ToHexTool() {
  const [input, setInput] = useState("");
  const out = useMemo(() => {
    try {
      const bin = atob(input.trim());
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return bytesToHex(bytes);
    } catch {
      return "";
    }
  }, [input]);
  return (
    <DevToolPageShell slug="base64-to-hex">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <textarea readOnly value={out} rows={4} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
    </DevToolPageShell>
  );
}

export function HexToBase64Tool() {
  const [input, setInput] = useState("4869");
  const out = useMemo(() => {
    try {
      const bytes = hexToBytes(input);
      let bin = "";
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
      return btoa(bin);
    } catch {
      return "";
    }
  }, [input]);
  return (
    <DevToolPageShell slug="hex-to-base64">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm" />
      <textarea readOnly value={out} rows={4} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-sm" />
    </DevToolPageShell>
  );
}

export function Base64ToImageTool() {
  const [input, setInput] = useState("");
  const src = useMemo(() => {
    const t = input.trim();
    if (!t) return "";
    if (t.startsWith("data:")) return t;
    return `data:image/png;base64,${t}`;
  }, [input]);
  return (
    <DevToolPageShell slug="base64-to-image">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-xs" placeholder="data:image/png;base64,... or raw base64" />
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt="Decoded from Base64"
          loading="lazy"
          className="mt-4 max-h-96 rounded-xl border border-border object-contain"
        />
      ) : null}
    </DevToolPageShell>
  );
}

export function ImageToBase64Tool() {
  const [dataUrl, setDataUrl] = useState("");
  return (
    <DevToolPageShell slug="image-to-base64">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const r = new FileReader();
          r.onload = () => setDataUrl(typeof r.result === "string" ? r.result : "");
          r.readAsDataURL(f);
        }}
        className="mt-2 text-sm"
      />
      {dataUrl ? (
        <>
          <textarea readOnly value={dataUrl} rows={6} className="mt-4 w-full rounded-xl border border-border bg-surface/80 px-4 py-3 font-mono text-xs" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dataUrl} alt="Preview" loading="lazy" className="mt-4 max-h-64 rounded-xl border object-contain" />
        </>
      ) : null}
    </DevToolPageShell>
  );
}
