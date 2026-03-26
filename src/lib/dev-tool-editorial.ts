import type { DevToolAdminOverride, DevToolsAdminDocument } from "@/lib/content";
import { sanitizeDevToolEditorialHtml } from "@/lib/dev-tool-html-sanitize";
import { htmlToPlainTextForSchema } from "@/lib/dev-tool-html-plain";

export type DevToolPublicFaqSanitized = {
  html: string;
};

/** Resolved admin content below the interactive tool (blog accordion + FAQ accordion + legacy HTML FAQ). */
export type DevToolPublicBelowFold = {
  blogHtml: string | null;
  /** Structured FAQ rows (admin); drives accordion + FAQPage when present. */
  structuredFaq: { id: string; question: string; answerHtml: string }[] | null;
  /** Legacy single HTML block when no `structuredFaq`. */
  legacyFaqHtml: string | null;
};

/** True when admin provides any FAQ copy (structured or legacy), so registry FAQ can be hidden. */
export function shouldHideRegistryDevToolFaq(below: DevToolPublicBelowFold): boolean {
  return (
    (below.structuredFaq !== null && below.structuredFaq.length > 0) ||
    (!!below.legacyFaqHtml && below.legacyFaqHtml.trim().length > 0)
  );
}

/** Raw HTML for admin FAQ field: `faqHtml`, else migrated from `editorialSections` / single section. */
export function getFaqHtmlForAdminForm(o: DevToolAdminOverride | undefined): string {
  if (!o) return "";
  if (o.faqHtml?.trim()) return o.faqHtml;
  if (Array.isArray(o.editorialSections) && o.editorialSections.length > 0) {
    const faq = o.editorialSections.find((s) => /^faq$/i.test((s.title ?? "").trim()));
    if (faq?.bodyHtml?.trim()) return faq.bodyHtml;
    if (o.editorialSections.length === 1) return o.editorialSections[0].bodyHtml ?? "";
  }
  return o.faqHtml ?? "";
}

function resolvePublicFaqHtmlRaw(o: DevToolAdminOverride): string | null {
  if (o.faqHtml?.trim()) return o.faqHtml;
  if (Array.isArray(o.editorialSections) && o.editorialSections.length > 0) {
    const faq = o.editorialSections.find((s) => /^faq$/i.test((s.title ?? "").trim()));
    if (faq?.bodyHtml?.trim()) return faq.bodyHtml;
    if (o.editorialSections.length === 1) return o.editorialSections[0].bodyHtml ?? null;
  }
  return null;
}

/** Single public FAQ block below the tool (sanitized HTML). */
export function getDevToolPublicFaqSanitized(
  doc: DevToolsAdminDocument | null,
  slug: string,
): DevToolPublicFaqSanitized | null {
  const o = doc?.overrides?.[slug];
  if (!o) return null;
  const raw = resolvePublicFaqHtmlRaw(o);
  if (!raw?.trim()) return null;
  return { html: sanitizeDevToolEditorialHtml(raw) };
}

function sanitizeFaqItems(
  items: NonNullable<DevToolAdminOverride["faqItems"]>,
): { id: string; question: string; answerHtml: string }[] {
  return items
    .map((row) => ({
      id: String(row.id ?? "").trim(),
      question: String(row.question ?? "").trim(),
      answerHtml: sanitizeDevToolEditorialHtml(row.answerHtml ?? ""),
    }))
    .filter((row) => row.id && (row.question || row.answerHtml.trim()));
}

/** Blog + FAQ accordions and legacy HTML (all sanitized). */
export function getDevToolPublicBelowFold(
  doc: DevToolsAdminDocument | null,
  slug: string,
): DevToolPublicBelowFold {
  const o = doc?.overrides?.[slug];
  if (!o) {
    return { blogHtml: null, structuredFaq: null, legacyFaqHtml: null };
  }
  const blogRaw = o.blogHtml?.trim();
  const blogHtml = blogRaw ? sanitizeDevToolEditorialHtml(blogRaw) : null;

  const structured = Array.isArray(o.faqItems) && o.faqItems.length > 0 ? sanitizeFaqItems(o.faqItems) : null;
  const structuredFaq = structured && structured.length > 0 ? structured : null;

  let legacyFaqHtml: string | null = null;
  if (!structuredFaq) {
    const raw = resolvePublicFaqHtmlRaw(o);
    if (raw?.trim()) legacyFaqHtml = sanitizeDevToolEditorialHtml(raw);
  }

  return { blogHtml, structuredFaq, legacyFaqHtml };
}

/** FAQPage JSON-LD: admin structured FAQs, else registry/code FAQs. Legacy HTML-only FAQ has no reliable Q&A pairs — omit FAQPage. */
export function getDevToolFaqSchemaPairs(
  doc: DevToolsAdminDocument | null,
  slug: string,
  registryFaqs: { question: string; answer: string }[],
): { question: string; answerPlain: string }[] {
  const below = getDevToolPublicBelowFold(doc, slug);
  if (below.structuredFaq && below.structuredFaq.length > 0) {
    return below.structuredFaq.map((row) => ({
      question: row.question,
      answerPlain: htmlToPlainTextForSchema(row.answerHtml) || row.question,
    }));
  }
  if (below.legacyFaqHtml && below.legacyFaqHtml.trim().length > 0) {
    return [];
  }
  return registryFaqs.map((f) => ({
    question: f.question,
    answerPlain: f.answer,
  }));
}
