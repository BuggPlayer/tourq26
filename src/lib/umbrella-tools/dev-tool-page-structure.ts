import type { DevToolCategory, UmbrellaTool } from "@/lib/umbrella-tools/types";

export type DevToolHowToStep = { name: string; text: string };

export type DevToolPageStructure = {
  /** Short phrase after an em dash in the H1 (what the tool does). */
  h1Function: string;
  /** 40–70 words, shown under the H1 above the interactive block. */
  introBlurb: string;
  features: string[];
  howToSteps: DevToolHowToStep[];
  benefits: string[];
};

function countWords(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function clipToWordCount(s: string, maxWords: number): string {
  const words = s.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ")}…`;
}

function buildIntroBlurb(tool: UmbrellaTool): string {
  if (tool.introBlurb?.trim()) {
    const t = tool.introBlurb.trim();
    const n = countWords(t);
    if (n >= 40 && n <= 70) return t;
    if (n > 70) return clipToWordCount(t, 70);
    const merged = `${tool.description.trim()} ${t}`.replace(/\s+/g, " ").trim();
    if (countWords(merged) >= 40) return clipToWordCount(merged, 70);
  }

  const base = tool.description.trim();
  const suffix =
    " Everything runs in your browser with no account. Paste or upload input, adjust options if needed, then copy or download the result. Built for quick one-off tasks and sharing output with your team.";
  const merged = (base + suffix).replace(/\s+/g, " ").trim();
  const n = countWords(merged);
  if (n >= 40 && n <= 70) return merged;
  if (n > 70) return clipToWordCount(merged, 70);

  const padded =
    merged +
    " We keep the UI focused so you can move fast—open the tool, run the action, and move on without installing desktop software.";
  return clipToWordCount(padded, 70);
}

const CATEGORY_H1_FUNCTION: Record<DevToolCategory, string> = {
  text: "Format, convert, and inspect text in your browser",
  url: "Parse, encode, and decode URLs and paths",
  html: "Format, escape, and validate HTML",
  markdown: "Edit and convert Markdown content",
  css: "Format, minify, and tune CSS",
  javascript: "Format, minify, and escape JavaScript",
  json: "Format, validate, and convert JSON",
  xml: "Format, escape, and convert XML",
  yaml: "Validate and convert YAML",
  csv: "Convert between CSV and structured data",
  php: "Convert PHP arrays and JSON",
  database: "Parse and inspect database connection strings",
  randomizers: "Generate secure random strings and secrets",
  base32: "Encode and decode Base32",
  base58: "Encode and decode Base58",
  base64: "Encode and decode Base64 and binary",
  hash: "Compute digests and checksums",
  hmac: "Generate keyed hashes (HMAC)",
  bcrypt: "Hash and verify passwords with bcrypt",
  qrcode: "Create and read QR codes in the browser",
  network: "Inspect network-related values and identifiers",
  checksum: "Calculate checksums and CRCs",
  pdf: "Merge, split, and extract PDF pages locally",
  pastebin: "Share plain text with a short link",
};

function defaultFeatures(title: string): string[] {
  const t = title.toLowerCase();
  return [
    `Purpose-built for fast ${t} workflows without leaving your browser tab.`,
    "Runs client-side in modern browsers—no install and no sign-up required.",
    "Clear inputs and outputs so you can copy results or download files when available.",
    "Free to use for personal and commercial work.",
  ];
}

const DEFAULT_HOW_TO: DevToolHowToStep[] = [
  {
    name: "Open the workspace",
    text: "Use the interactive area on this page. It loads immediately and does not require an account.",
  },
  {
    name: "Add your input",
    text: "Paste text, upload a file if the tool supports it, or fill in the fields and options for your case.",
  },
  {
    name: "Run the tool",
    text: "Click the primary action (for example Format, Encode, Generate, or Calculate) to produce output from your input.",
  },
  {
    name: "Copy or export",
    text: "Copy the result to your clipboard or use Download when offered. You can also select output manually.",
  },
];

function defaultBenefits(title: string): string[] {
  return [
    `Saves time compared to one-off CLI commands or ad-hoc scripts for ${title.toLowerCase()}.`,
    "Keeps drafts local in the browser when the tool does not call external APIs—check the FAQs for exceptions.",
    "Predictable output you can paste into tickets, docs, or your codebase.",
  ];
}

/**
 * Resolved editorial + above-the-fold copy for standard dev-tool pages.
 * Per-tool overrides live on {@link UmbrellaTool}; sensible defaults keep every tool page complete.
 */
export function resolveDevToolPageStructure(tool: UmbrellaTool): DevToolPageStructure {
  const h1Function = tool.h1Function?.trim() || CATEGORY_H1_FUNCTION[tool.category];
  const introBlurb = buildIntroBlurb(tool);
  const features =
    tool.features?.length && tool.features.length >= 3 ? tool.features : defaultFeatures(tool.title);
  const howToSteps =
    tool.howToSteps?.length && tool.howToSteps.length >= 3 ? tool.howToSteps : DEFAULT_HOW_TO;
  const benefits =
    tool.benefits?.length && tool.benefits.length >= 3 ? tool.benefits : defaultBenefits(tool.title);

  return { h1Function, introBlurb, features, howToSteps, benefits };
}
