/** One-off generator: writes src/lib/umbrella-tools/tools-registry-extra.ts */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "../src/lib/umbrella-tools/tools-registry-extra.ts");

const rows = [
  // Text
  ["word-counter", "Word counter", "Count words, characters, and lines as you type — Unicode-aware.", "text", "W"],
  ["case-converter", "Case converter", "lower, UPPER, camelCase, PascalCase, snake_case, CONSTANT_CASE, Train-Case.", "text", "Aa"],
  ["line-sorter", "Line sorter", "Sort, reverse, shuffle lines; optional line numbers — all client-side.", "text", "↕"],
  ["whitespace-remover", "Whitespace remover", "Trim lines, collapse spaces, or strip all whitespace.", "text", "␣"],
  ["lorem-ipsum-generator", "Lorem ipsum generator", "Generate placeholder paragraphs with adjustable length.", "text", "L"],
  ["text-to-hex", "Text to HEX", "UTF-8 bytes to space-delimited hex.", "text", "₀x"],
  ["hex-to-text", "HEX to text", "Decode hex (with or without separators) back to UTF-8 text.", "text", "x₀"],
  // URL
  ["url-parser", "URL parser", "Inspect scheme, host, path, query, and hash with the URL API.", "url", "⊶"],
  ["url-encoder", "URL encoder", "Percent-encode text for safe use in URLs and query strings.", "url", "%"],
  ["url-decoder", "URL decoder", "Decode percent-encoded strings to readable text.", "url", "‰"],
  ["slug-generator", "Slug generator", "SEO-friendly URL slugs from titles — lowercase, hyphenated.", "url", "─"],
  // HTML
  ["html-formatter", "HTML formatter", "Pretty-print HTML with js-beautify for readability.", "html", "</>"],
  ["html-minifier", "HTML minifier", "Remove extra whitespace and shrink HTML for production.", "html", "⟨⟩"],
  ["html-encoder", "HTML encoder", "Encode text to numeric / named HTML entities.", "html", "&"],
  ["html-decoder", "HTML decoder", "Decode HTML entities back to characters.", "html", "&&"],
  ["html-escape", "HTML escape", "Escape &, <, >, quotes for safe embedding in HTML.", "html", "\\"],
  ["html-unescape", "HTML unescape", "Unescape common HTML entities.", "html", "∽"],
  ["html-validator", "HTML validator", "Well-formedness check (DOMParser) — not a full W3C nu validator.", "html", "✓"],
  ["html-stripper", "HTML stripper", "Remove tags and keep text (best-effort).", "html", "⌫"],
  // Markdown
  ["markdown-editor", "Markdown editor", "Edit Markdown with a live HTML preview (marked).", "markdown", "M↓"],
  ["markdown-to-html", "Markdown to HTML", "Convert Markdown to HTML in the browser.", "markdown", "→"],
  ["html-to-markdown", "HTML to Markdown", "Convert HTML to Markdown (turndown).", "markdown", "←"],
  // CSS
  ["css-beautifier", "CSS beautifier", "Pretty-print CSS stylesheets.", "css", "{}"],
  ["css-minifier", "CSS minifier", "Minify CSS with clean-css.", "css", "{·}"],
  ["css-validator", "CSS validator", "Basic brace/bracket balance and structure hints — not full W3C.", "css", "✓"],
  // JavaScript
  ["js-beautifier", "JavaScript beautifier", "Pretty-print JavaScript with js-beautify.", "javascript", "JS"],
  ["js-minifier", "JavaScript minifier", "Minify JS with terser (may fail on invalid syntax).", "javascript", "js"],
  ["js-escape", "JavaScript escape", "Escape a string for use inside JavaScript quotes.", "javascript", "⧵"],
  ["js-unescape", "JavaScript unescape", "Unescape JavaScript string escapes.", "javascript", "⧹"],
  // JSON (additional)
  ["json-minifier", "JSON minifier", "Remove whitespace from JSON — compact one-liner.", "json", "{}"],
  ["json-escape", "JSON escape", "Escape a string for embedding in JSON.", "json", "\\"],
  ["json-unescape", "JSON unescape", "Unescape JSON string escapes.", "json", "∽"],
  ["json-validator-standalone", "JSON validator", "Validate JSON and show parse errors with position.", "json", "✓"],
  // XML
  ["xml-formatter", "XML formatter", "Pretty-print XML with indentation.", "xml", "<>"],
  ["xml-minifier", "XML minifier", "Collapse whitespace in XML.", "xml", "⟨⟩"],
  ["xml-encoder", "XML encoder", "Encode special characters for XML text nodes.", "xml", "&"],
  ["xml-decoder", "XML decoder", "Decode XML entities.", "xml", "∽"],
  ["xml-escape", "XML escape", "Escape &, <, >, quotes for XML.", "xml", "\\"],
  ["xml-unescape", "XML unescape", "Unescape XML entities.", "xml", "∽"],
  ["xml-validator", "XML validator", "Parse XML and report errors (DOMParser).", "xml", "✓"],
  ["xml-to-json", "XML to JSON", "Convert XML to JSON (fast-xml-parser).", "xml", "⇒"],
  ["json-to-xml", "JSON to XML", "Convert JSON to a simple XML document.", "xml", "⇐"],
  // YAML
  ["yaml-validator", "YAML validator", "Parse YAML and report errors (yaml package).", "yaml", "✓"],
  ["yaml-to-json", "YAML to JSON", "Convert YAML to formatted JSON.", "yaml", "⇒"],
  ["json-to-yaml", "JSON to YAML", "Convert JSON to YAML.", "yaml", "⇐"],
  // CSV
  ["csv-to-json", "CSV to JSON", "Parse CSV to JSON arrays with Papa Parse.", "csv", "⇒"],
  // PHP
  ["php-array-to-json", "PHP array to JSON", "Paste a PHP array literal — best-effort convert to JSON.", "php", "⇒"],
  ["json-to-php-array", "JSON to PHP array", "Convert JSON to a PHP array string.", "php", "⇐"],
  // Database / SQL
  ["sql-formatter", "SQL formatter", "Pretty-print SQL with sql-formatter.", "database", "§"],
  ["sql-minifier", "SQL minifier", "Strip SQL comments and collapse whitespace.", "database", "§·"],
  ["sql-escape", "SQL escape", "Escape single quotes for SQL string literals.", "database", "'"],
  // Randomizers
  ["password-generator", "Password generator", "Cryptographically random passwords — length and charset.", "randomizers", "🔑"],
  ["passphrase-generator", "Passphrase generator", "Random word-style passphrases from a word list.", "randomizers", "📝"],
  ["pin-generator", "PIN generator", "Numeric PINs with secure randomness.", "randomizers", "#"],
  // Base32 extras
  ["base32-encoder", "Base32 encoder", "Encode UTF-8 text to RFC 4648 Base32.", "base32", "Ⓑ"],
  ["base32-decoder", "Base32 decoder", "Decode Base32 to UTF-8 text.", "base32", "Ⓑ"],
  ["base32-to-hex", "Base32 to HEX", "Decode Base32 to hex string.", "base32", "→"],
  ["hex-to-base32", "HEX to Base32", "Encode hex bytes as Base32.", "base32", "←"],
  // Base58
  ["base58-encoder", "Base58 encoder", "Encode UTF-8 bytes as Base58.", "base58", "₿"],
  ["base58-decoder", "Base58 decoder", "Decode Base58 to UTF-8.", "base58", "₿"],
  ["base58-to-hex", "Base58 to HEX", "Decode Base58 to hex.", "base58", "→"],
  ["hex-to-base58", "HEX to Base58", "Encode hex as Base58.", "base58", "←"],
  // Base64
  ["base64-encoder", "Base64 encoder", "Encode UTF-8 text to Base64.", "base64", "⊕"],
  ["base64-decoder", "Base64 decoder", "Decode Base64 to UTF-8 text.", "base64", "⊕"],
  ["base64-to-hex", "Base64 to HEX", "Decode Base64 to hex bytes.", "base64", "→"],
  ["hex-to-base64", "HEX to Base64", "Encode hex as Base64.", "base64", "←"],
  ["base64-to-image", "Base64 to image", "Render a data URL / raw Base64 image in the browser.", "base64", "🖼"],
  ["image-to-base64", "Image to Base64", "Read a local image file to Base64 data URL.", "base64", "📎"],
  // Hash singles
  ["md5-hash-generator", "MD5 hash generator", "MD5 digest (crypto-js) — not for security.", "hash", "⒨"],
  ["sha1-hash-generator", "SHA-1 hash generator", "SHA-1 digest — legacy interoperability.", "hash", "⒮"],
  ["sha224-hash-generator", "SHA-224 hash generator", "SHA-224 digest.", "hash", "⒯"],
  ["sha256-hash-generator", "SHA-256 hash generator", "SHA-256 digest.", "hash", "⒮"],
  ["sha384-hash-generator", "SHA-384 hash generator", "SHA-384 digest.", "hash", "⒮"],
  ["sha512-hash-generator", "SHA-512 hash generator", "SHA-512 digest.", "hash", "⒮"],
  ["sha3-hash-generator", "SHA-3 hash generator", "SHA3-256 digest (crypto-js).", "hash", "⒮"],
  ["ripemd160-hash-generator", "RIPEMD-160 hash generator", "RIPEMD-160 digest.", "hash", "Ⓡ"],
  // HMAC singles
  ["hmac-md5", "MD5 HMAC generator", "HMAC-MD5 hex.", "hmac", "⒨"],
  ["hmac-sha1", "SHA-1 HMAC generator", "HMAC-SHA1 hex.", "hmac", "⒮"],
  ["hmac-sha224", "SHA-224 HMAC generator", "HMAC-SHA224 hex.", "hmac", "⒯"],
  ["hmac-sha256", "SHA-256 HMAC generator", "HMAC-SHA256 hex.", "hmac", "⒮"],
  ["hmac-sha384", "SHA-384 HMAC generator", "HMAC-SHA384 hex.", "hmac", "⒮"],
  ["hmac-sha512", "SHA-512 HMAC generator", "HMAC-SHA512 hex.", "hmac", "⒮"],
  ["hmac-sha3", "SHA-3 HMAC generator", "HMAC-SHA3 hex.", "hmac", "⒮"],
  ["hmac-ripemd160", "RIPEMD-160 HMAC generator", "HMAC-RIPEMD160 hex.", "hmac", "Ⓡ"],
  // Bcrypt split labels
  ["bcrypt-generator", "Bcrypt generator", "Generate bcrypt hashes with configurable cost.", "bcrypt", "⚿"],
  ["bcrypt-checker", "Bcrypt checker", "Verify a password against a bcrypt hash.", "bcrypt", "⚿"],
  // QR
  ["qr-to-text", "QR code to text", "Decode QR from an image file — processing stays in your browser.", "qrcode", "▢"],
  // Network
  ["my-ip", "My IP", "Shows your public IP as seen by this site (server header).", "network", "🌐"],
  ["my-user-agent", "My user agent", "Display navigator.userAgent and platform hints.", "network", "🧭"],
];

const body = `import type { UmbrellaTool } from "./types";

/** Auto-generated — additional catalog tools. Merged into UMBRELLA_TOOLS in tools-config. */
export const EXTRA_UMBRELLA_TOOLS: UmbrellaTool[] = [
${rows
  .map(
    ([slug, title, description, category, icon]) =>
      `  {\n    slug: ${JSON.stringify(slug)},\n    title: ${JSON.stringify(title)},\n    description: ${JSON.stringify(description)},\n    category: ${JSON.stringify(category)},\n    icon: ${JSON.stringify(icon)},\n  },`,
  )
  .join("\n")}
];
`;

fs.writeFileSync(out, body);
console.log("Wrote", out, rows.length, "tools");
