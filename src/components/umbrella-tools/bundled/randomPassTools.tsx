"use client";

import { useMemo, useState } from "react";
import { DevToolPageShell } from "@/components/umbrella-tools/DevToolPageShell";

const WORDS = [
  "amber", "river", "orbit", "falcon", "matrix", "signal", "vector", "cipher", "quartz", "nebula",
  "harbor", "summit", "cascade", "vertex", "prism", "echo", "nova", "pixel", "kernel", "socket",
  "token", "ledger", "anchor", "beacon", "compass", "harvest", "meadow", "coral", "fossil", "granite",
  "ember", "frost", "solar", "lunar", "radar", "sonar", "delta", "sigma", "omega", "alpha",
  "bronze", "silver", "copper", "nickel", "chrome", "titanium", "carbon", "silicon", "argon", "neon",
];

function randomBytes(n: number) {
  const buf = new Uint8Array(n);
  crypto.getRandomValues(buf);
  return buf;
}

export function PasswordGeneratorTool() {
  const [len, setLen] = useState(20);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [num, setNum] = useState(true);
  const [sym, setSym] = useState(true);
  const charset = useMemo(() => {
    let s = "";
    if (upper) s += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lower) s += "abcdefghijklmnopqrstuvwxyz";
    if (num) s += "0123456789";
    if (sym) s += "!@#$%^&*()-_=+[]{}";
    return s;
  }, [upper, lower, num, sym]);
  const [tick, setTick] = useState(0);
  const password = useMemo(() => {
    if (!charset.length) return "";
    const bytes = randomBytes(len);
    bytes[0] = (bytes[0]! + tick) % 256;
    let out = "";
    for (let i = 0; i < len; i++) {
      out += charset[bytes[i]! % charset.length]!;
    }
    return out;
  }, [len, charset, tick]);
  return (
    <DevToolPageShell slug="password-generator">
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} /> A–Z
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} /> a–z
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={num} onChange={(e) => setNum(e.target.checked)} /> 0–9
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={sym} onChange={(e) => setSym(e.target.checked)} /> Symbols
        </label>
      </div>
      <label className="text-sm text-muted-foreground">Length: {len}</label>
      <input type="range" min={8} max={64} value={len} onChange={(e) => setLen(+e.target.value)} className="mt-2 w-full accent-primary" />
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => setTick((t) => t + 1)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Regenerate
        </button>
      </div>
      <pre className="mt-4 overflow-x-auto break-all rounded-xl border border-border bg-surface p-4 font-mono text-sm">{password}</pre>
    </DevToolPageShell>
  );
}

export function PassphraseGeneratorTool() {
  const [words, setWords] = useState(5);
  const [tick, setTick] = useState(0);
  const phrase = useMemo(() => {
    const b = randomBytes(words * 2);
    b[0] ^= tick & 255;
    const parts: string[] = [];
    for (let i = 0; i < words; i++) {
      const idx = (b[i * 2]! << 8) | b[i * 2 + 1]!;
      parts.push(WORDS[idx % WORDS.length]!);
    }
    return parts.join("-");
  }, [words, tick]);
  return (
    <DevToolPageShell slug="passphrase-generator">
      <label className="text-sm text-muted-foreground">Words: {words}</label>
      <input type="range" min={3} max={12} value={words} onChange={(e) => setWords(+e.target.value)} className="mt-2 w-full accent-primary" />
      <button
        type="button"
        onClick={() => setTick((t) => t + 1)}
        className="mt-4 rounded-lg border px-4 py-2 text-sm"
      >
        Regenerate
      </button>
      <pre className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface p-4 font-mono text-lg">{phrase}</pre>
    </DevToolPageShell>
  );
}

export function PinGeneratorTool() {
  const [digits, setDigits] = useState(6);
  const [tick, setTick] = useState(0);
  const pin = useMemo(() => {
    const b = randomBytes(digits);
    b[0] = (b[0]! + tick) % 256;
    let s = "";
    for (let i = 0; i < digits; i++) {
      s += String(b[i]! % 10);
    }
    return s;
  }, [digits, tick]);
  return (
    <DevToolPageShell slug="pin-generator">
      <label className="text-sm text-muted-foreground">Digits: {digits}</label>
      <input type="range" min={4} max={12} value={digits} onChange={(e) => setDigits(+e.target.value)} className="mt-2 w-full accent-primary" />
      <button type="button" onClick={() => setTick((t) => t + 1)} className="mt-4 rounded-lg border px-4 py-2 text-sm">
        Regenerate
      </button>
      <p className="mt-6 font-mono text-3xl font-bold tracking-widest">{pin}</p>
    </DevToolPageShell>
  );
}
