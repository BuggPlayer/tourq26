import type { DevToolCategory } from "@/lib/umbrella-tools/types";

/** Appended when `seoDescription` is absent — varies by category to reduce duplicate meta text. */
export const DEV_TOOL_CATEGORY_META_TAIL: Record<DevToolCategory, string> = {
  text: "Free online text utility — runs in your browser, no signup.",
  url: "Free URL tool — client-side only; nothing uploaded to our servers.",
  html: "Free HTML utility — processed locally in your browser.",
  markdown: "Free Markdown utility — runs client-side in your browser.",
  css: "Free CSS developer tool — works locally in your browser.",
  javascript: "Free JavaScript utility — client-side, no server round-trip.",
  json: "Free JSON tool — your data stays in the browser tab.",
  xml: "Free XML utility — parse and convert locally, no upload.",
  yaml: "Free YAML tool — runs in your browser; no account required.",
  csv: "Free CSV / tabular data utility — client-side processing.",
  php: "Free PHP helper — runs in your browser for quick conversions.",
  database: "Free database utility — connection strings parsed locally in your browser.",
  randomizers: "Free randomizer — cryptographically strong where supported; runs locally.",
  base32: "Free Base32 tool — encode and decode in your browser.",
  base58: "Free Base58 tool — runs locally; no data sent to our servers.",
  base64: "Free Base64 tool — UTF-8 safe; processed entirely client-side.",
  hash: "Free hash generator — digests computed in your browser only.",
  hmac: "Free HMAC tool — keyed hashes for debugging; stays in this tab.",
  bcrypt: "Free bcrypt utility — passwords never leave your browser.",
  qrcode: "Free QR tool — generated or decoded locally in your browser.",
  network: "Free network calculator — IPv4 and IP info without server-side storage.",
  checksum: "Free checksum utility — integrity checks over UTF-8 in your browser.",
  pdf: "Free PDF tool — merge or extract pages locally; files are not uploaded to our servers.",
  pastebin: "Free pastebin — optional share links; content stays client-side or in the URL.",
};
