/**
 * Single registry for /dev-tools — categories match the public hub (Text, URL, HTML, …).
 * Core tools live in `tools-registry-core.ts`; extra catalog rows in `tools-registry-extra.ts` (generated).
 */
import type { DevToolCategory, UmbrellaTool } from "./types";
import { CORE_UMBRELLA_TOOLS } from "./tools-registry-core";
import { EXTRA_UMBRELLA_TOOLS } from "./tools-registry-extra";
import { applyDevToolSeoOverrides } from "./seo-overrides";

export type { DevToolCategory, UmbrellaTool } from "./types";

function mergeUmbrellaTools(): UmbrellaTool[] {
  const map = new Map<string, UmbrellaTool>();
  for (const t of CORE_UMBRELLA_TOOLS) map.set(t.slug, t);
  for (const t of EXTRA_UMBRELLA_TOOLS) {
    if (!map.has(t.slug)) map.set(t.slug, t);
  }
  const order = DEV_TOOL_CATEGORY_ORDER;
  const catIndex = (c: DevToolCategory) => order.indexOf(c);
  const sorted = [...map.values()].sort((a, b) => {
    const d = catIndex(a.category) - catIndex(b.category);
    if (d !== 0) return d;
    return a.title.localeCompare(b.title);
  });
  return sorted.map(applyDevToolSeoOverrides);
}

/** Section titles on /dev-tools */
export const DEV_TOOL_CATEGORY_LABELS: Record<DevToolCategory, string> = {
  text: "Text Tools",
  url: "URL Tools",
  html: "HTML Tools",
  markdown: "Markdown Tools",
  css: "CSS Tools",
  javascript: "JavaScript Tools",
  json: "JSON Tools",
  xml: "XML Tools",
  yaml: "YAML Tools",
  csv: "CSV Tools",
  php: "PHP Tools",
  database: "Database Tools",
  randomizers: "Randomizers",
  base32: "Base32 Tools",
  base58: "Base58 Tools",
  base64: "Base64 Tools",
  hash: "Hash Generators",
  hmac: "HMAC Generators",
  bcrypt: "Bcrypt Tools",
  qrcode: "QR Code Tools",
  network: "Network Tools",
  checksum: "Checksum Tools",
  pdf: "PDF Tools",
  pastebin: "Pastebin",
};

/** Order of sections on the hub (SEO + UX). */
export const DEV_TOOL_CATEGORY_ORDER: DevToolCategory[] = [
  "text",
  "url",
  "html",
  "markdown",
  "css",
  "javascript",
  "json",
  "xml",
  "yaml",
  "csv",
  "php",
  "database",
  "randomizers",
  "base32",
  "base58",
  "base64",
  "hash",
  "hmac",
  "bcrypt",
  "qrcode",
  "network",
  "checksum",
  "pdf",
  "pastebin",
];

/** Short line under each section heading (only shown when the section has tools). */
export const DEV_TOOL_CATEGORY_BLURB: Record<DevToolCategory, string> = {
  text: "Encoding, hashing, UUIDs, timestamps — string and digest helpers.",
  url: "Percent-encoding for queries, paths, and components.",
  html: "Markup utilities (expand this group as you ship tools).",
  markdown: "Markdown helpers (expand this group as you ship tools).",
  css: "Styles, shadows, and SVG → CSS for production.",
  javascript: "JS-focused utilities (expand this group as you ship tools).",
  json: "Format JSON, inspect JWTs — no server round-trip.",
  xml: "XML utilities (expand this group as you ship tools).",
  yaml: "YAML utilities (expand this group as you ship tools).",
  csv: "Convert and export tabular data.",
  php: "PHP helpers (expand this group as you ship tools).",
  database: "Parse connection strings and inspect host, port, and database name.",
  randomizers: "Secure random strings and values for tokens and test data.",
  base32: "RFC 4648 Base32 encode and decode in the browser.",
  base58: "Bitcoin-style Base58 for compact binary-safe text.",
  base64: "Standard Base64 for UTF-8 text, APIs, and debugging.",
  hash: "SHA and other digests with Web Crypto — client-side only.",
  hmac: "Keyed hashes for signatures and API authentication.",
  bcrypt: "Password hashing and comparison with bcrypt.",
  qrcode: "Generate QR codes from text or URLs — download or copy.",
  network: "CIDR, subnets, and IPv4 addressing helpers.",
  checksum: "CRC and lightweight integrity checks over UTF-8 bytes.",
  pdf: "Merge PDFs and extract page ranges — all processing runs in your browser.",
  pastebin: "Scratch pad and shareable links — everything stays in the browser or the URL.",
};

export const UMBRELLA_TOOLS: UmbrellaTool[] = mergeUmbrellaTools();

export function toolsByCategory(category: DevToolCategory) {
  return UMBRELLA_TOOLS.filter((t) => t.category === category);
}

export function getDevToolBySlug(slug: string): UmbrellaTool | undefined {
  return UMBRELLA_TOOLS.find((t) => t.slug === slug);
}

/** Filter tools by search query (title, description, slug, category label). */
export function filterUmbrellaTools(query: string): UmbrellaTool[] {
  const s = query.trim().toLowerCase();
  if (!s) return UMBRELLA_TOOLS;
  return UMBRELLA_TOOLS.filter(
    (t) =>
      t.title.toLowerCase().includes(s) ||
      t.description.toLowerCase().includes(s) ||
      t.slug.includes(s) ||
      DEV_TOOL_CATEGORY_LABELS[t.category].toLowerCase().includes(s),
  );
}

/** Group tools into category sections following hub order; empty categories omitted. */
export function groupToolsByCategoryOrder(tools: UmbrellaTool[]) {
  const order = DEV_TOOL_CATEGORY_ORDER;
  const map = new Map<string, UmbrellaTool[]>();
  for (const c of order) map.set(c, []);
  for (const t of tools) {
    map.get(t.category)?.push(t);
  }
  return order.map((cat) => ({ category: cat, tools: map.get(cat) ?? [] })).filter((g) => g.tools.length > 0);
}

/** Same category first, then other tools — for “Related tools” on tool pages. */
export function getRelatedDevTools(slug: string, limit = 6): UmbrellaTool[] {
  const current = getDevToolBySlug(slug);
  if (!current) return [];
  const same = UMBRELLA_TOOLS.filter((t) => t.slug !== slug && t.category === current.category);
  const rest = UMBRELLA_TOOLS.filter((t) => t.slug !== slug && t.category !== current.category);
  return [...same, ...rest].slice(0, limit);
}
