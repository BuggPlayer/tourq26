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
  | "network"
  | "checksum"
  | "pdf"
  | "pastebin";

export type UmbrellaTool = {
  slug: string;
  title: string;
  description: string;
  category: DevToolCategory;
  icon: string;
  keywords?: string[];
  badge?: string;
  /** Optional SERP title (≤~60 chars). Falls back to `title`. */
  seoTitle?: string;
  /** Optional meta description (≤~155 chars). Falls back to description + category tail. */
  seoDescription?: string;
  /**
   * Optional visible copy for search & users (plain text). Use double newlines (`\n\n`) between paragraphs.
   * Shown below the header — unique content helps rankings; keep factual and useful.
   */
  seoIntro?: string;
  /** Optional FAQ for the tool page (accordion + FAQPage JSON-LD). */
  faq?: { question: string; answer: string }[];
};
