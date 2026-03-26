import type { UmbrellaTool } from "./types";

/**
 * Per-slug SEO patches merged after the core + extra registries.
 * Safe when `tools-registry-extra.ts` is regenerated — keep high-value tool copy here.
 */
export const DEV_TOOL_SEO_OVERRIDES: Record<string, Partial<UmbrellaTool>> = {
  "case-converter": {
    keywords: [
      "case converter online",
      "camelCase converter",
      "snake case converter",
      "uppercase lowercase converter",
      "pascal case online",
      "constant case generator",
      "train case text",
      "free text case converter",
    ],
    seoTitle: "Free online case converter — camelCase, snake_case, UPPER, lower",
    seoDescription:
      "Convert text between lower, UPPER, camelCase, PascalCase, snake_case, CONSTANT_CASE, and Train-Case. Free browser tool — no upload, instant conversion.",
    seoIntro:
      "Use this free case converter to switch naming styles for code, APIs, SEO slugs, and documentation. It works entirely in your browser: your text never leaves this page.\n\nDevelopers use camelCase and PascalCase for JavaScript and C#, snake_case for Python and Ruby, SCREAMING_SNAKE for constants, and Train-Case for titles. Click a button to transform the current text — edit and convert again as often as you need.",
  },
  "json-formatter": {
    title: "JSON formatter & validator",
    seoIntro:
      "This JSON formatter helps you inspect JSON, spot syntax errors, and turn minified API responses into readable, indented text. Use it as a quick editor: paste, format or minify, and fix issues with fast feedback. Validation uses the same rules as JavaScript's JSON.parse — so what passes here follows standard JSON syntax.\n\nFormat, minify, and validate in one place. Your JSON is processed in this browser tab — nothing is sent to our servers for formatting.",
  },
  "slug-generator": {
    keywords: [
      "url slug generator",
      "seo slug generator",
      "slugify online",
      "hyphenated url slug",
      "free slug generator",
      "title to slug",
    ],
    seoTitle: "Free URL slug generator — SEO-friendly slugs from titles online",
    seoDescription:
      "Turn titles into lowercase, hyphenated URL slugs. Free online slug generator — no upload, runs in your browser. Copy the result in one click.",
    seoIntro:
      "Turn headlines into clean, hyphenated URL slugs: lowercase, accents stripped, punctuation collapsed to hyphens. Copy the result in one click — all processing runs in your browser.",
  },
};

export function applyDevToolSeoOverrides(tool: UmbrellaTool): UmbrellaTool {
  const patch = DEV_TOOL_SEO_OVERRIDES[tool.slug];
  return patch ? { ...tool, ...patch } : tool;
}
