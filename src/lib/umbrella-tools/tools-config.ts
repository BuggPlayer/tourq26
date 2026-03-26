/**
 * Single registry for /dev-tools — categories match the public hub (Text, URL, HTML, …).
 * Add tools here; empty categories are hidden on the index until you ship utilities.
 */
export type DevToolCategory =
  | "text"
  | "url"
  | "html"
  | "markdown"
  | "css"
  | "javascript"
  | "json"
  | "xml"
  | "yaml"
  | "csv"
  | "php"
  | "database"
  | "randomizers"
  | "base32"
  | "base58"
  | "base64"
  | "hash"
  | "hmac"
  | "bcrypt"
  | "qrcode"
  | "network";

export type UmbrellaTool = {
  slug: string;
  title: string;
  description: string;
  category: DevToolCategory;
  icon: string;
  keywords?: string[];
  badge?: string;
};

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
};

export const UMBRELLA_TOOLS: UmbrellaTool[] = [
  {
    slug: "svg-to-css-background",
    title: "SVG → CSS background",
    description: "Turn inline SVG into a data URL and copy-ready background-image CSS.",
    category: "css",
    icon: "◈",
    keywords: ["svg to css", "background-image", "data url"],
  },
  {
    slug: "css-shadow-generator",
    title: "CSS box-shadow",
    description: "Live preview for offset, blur, spread, and color — copy the value in one click.",
    category: "css",
    icon: "◐",
    keywords: ["box-shadow generator", "css shadow"],
  },
  {
    slug: "json-formatter",
    title: "JSON formatter",
    description: "Format, minify, and validate JSON — fix payloads before APIs or configs.",
    category: "json",
    icon: "{}",
    keywords: ["json formatter", "json minify", "json validator online"],
  },
  {
    slug: "jwt-decoder",
    title: "JWT decoder",
    description: "Inspect header and payload (Base64URL). Read-only — does not verify signatures.",
    category: "json",
    icon: "◎",
    keywords: ["jwt decode", "jwt parser online", "json web token"],
  },
  {
    slug: "json-to-csv",
    title: "JSON → CSV",
    description: "Convert JSON arrays to CSV with instant preview and download.",
    category: "csv",
    icon: "▤",
    keywords: ["json to csv", "export csv"],
  },
  {
    slug: "base64",
    title: "Base64 encode / decode",
    description: "Encode or decode Base64 for UTF-8 text — handy for APIs, tokens, and debugging.",
    category: "base64",
    icon: "⊕",
    keywords: ["base64 encode", "base64 decode online", "utf-8 base64"],
  },
  {
    slug: "hash-generator",
    title: "SHA hash generator",
    description: "Compute SHA-256, SHA-384, or SHA-512 digests of any text — Web Crypto, client-side only.",
    category: "hash",
    icon: "#",
    keywords: ["sha256 online", "sha512 hash", "generate hash"],
  },
  {
    slug: "uuid-generator",
    title: "UUID generator",
    description: "Generate RFC 4122 v4 UUIDs with one click — copy individually or all at once.",
    category: "text",
    icon: "◇",
    keywords: ["uuid generator", "guid generator online", "random uuid"],
  },
  {
    slug: "timestamp-converter",
    title: "Unix timestamp converter",
    description: "Convert Unix seconds or milliseconds ↔ ISO 8601 dates in local and UTC.",
    category: "text",
    icon: "◷",
    keywords: ["unix timestamp converter", "epoch converter", "iso 8601"],
  },
  {
    slug: "url-encode",
    title: "URL encode / decode",
    description: "Percent-encode or decode query strings and path components safely in the browser.",
    category: "url",
    icon: "§",
    keywords: ["url encode", "percent encode", "decodeURIComponent"],
  },
  {
    slug: "database-url-parser",
    title: "Database URL parser",
    description:
      "Split PostgreSQL, MySQL, MongoDB, Redis, and other connection URLs into scheme, host, port, user, and database.",
    category: "database",
    icon: "▢",
    keywords: ["postgres connection string", "mysql url parser", "database url"],
  },
  {
    slug: "random-string",
    title: "Random string generator",
    description: "Generate cryptographically random strings — length, charset, and one-click copy.",
    category: "randomizers",
    icon: "✧",
    keywords: ["random string", "secure random", "token generator"],
  },
  {
    slug: "base32-encode-decode",
    title: "Base32 encode / decode",
    description: "RFC 4648 Base32 for encoded identifiers, OTP secrets, and text-safe binary.",
    category: "base32",
    icon: "Ⓑ",
    keywords: ["base32 encode", "rfc 4648", "base32 decode"],
  },
  {
    slug: "base58-encode-decode",
    title: "Base58 encode / decode",
    description: "Bitcoin-style Base58 — compact, avoids ambiguous characters (0, O, I, l).",
    category: "base58",
    icon: "₿",
    keywords: ["base58", "bitcoin encoding"],
  },
  {
    slug: "hmac-generator",
    title: "HMAC generator",
    description: "Compute HMAC-SHA-256/384/512 hex for a secret and message — useful for webhooks and APIs.",
    category: "hmac",
    icon: "⌬",
    keywords: ["hmac sha256", "hmac generator online", "webhook signature"],
  },
  {
    slug: "bcrypt-hash",
    title: "Bcrypt hash & compare",
    description: "Hash passwords with bcrypt or verify a password against a hash — runs locally in your browser.",
    category: "bcrypt",
    icon: "⚿",
    keywords: ["bcrypt online", "bcrypt compare", "password hash"],
  },
  {
    slug: "qr-code-generator",
    title: "QR code generator",
    description: "Turn any text or URL into a QR code — PNG data URL for download or embedding.",
    category: "qrcode",
    icon: "▣",
    keywords: ["qr code generator", "qr online"],
  },
  {
    slug: "cidr-calculator",
    title: "CIDR calculator",
    description: "IPv4 CIDR — network and broadcast addresses, subnet mask, and usable host range.",
    category: "network",
    icon: "⬚",
    keywords: ["cidr calculator", "subnet calculator", "ipv4 cidr"],
  },
];

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
