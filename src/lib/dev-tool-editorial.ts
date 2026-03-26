import type { DevToolAdminOverride, DevToolsAdminDocument } from "@/lib/content";
import { sanitizeDevToolEditorialHtml } from "@/lib/dev-tool-html-sanitize";

export type DevToolPublicFaqSanitized = {
  html: string;
};

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
