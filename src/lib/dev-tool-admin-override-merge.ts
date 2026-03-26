import type { DevToolAdminOverride } from "@/lib/content";

const TRIMMABLE_STRING_KEYS: (keyof DevToolAdminOverride)[] = [
  "notes",
  "featuresHtml",
  "bestPracticesHtml",
  "faqHtml",
  "blogHtml",
];

function trimEmptyDevToolOverride(o: DevToolAdminOverride): DevToolAdminOverride | null {
  const out: DevToolAdminOverride = {};
  const hasEditorialSections = Array.isArray(o.editorialSections) && o.editorialSections.length > 0;
  const hasFaq = typeof o.faqHtml === "string" && o.faqHtml.trim().length > 0;
  const hasStructuredFaq = Array.isArray(o.faqItems) && o.faqItems.length > 0;

  for (const [k, v] of Object.entries(o)) {
    if (v === undefined) continue;
    const key = k as keyof DevToolAdminOverride;

    if (key === "editorialSections" && Array.isArray(v)) {
      if (hasFaq) continue;
      const filtered = v
        .map((s) => ({
          id: String((s as { id?: string }).id ?? "").trim(),
          title: String((s as { title?: string }).title ?? ""),
          bodyHtml: String((s as { bodyHtml?: string }).bodyHtml ?? ""),
        }))
        .filter((s) => s.id && (s.title.trim() || s.bodyHtml.trim()));
      if (filtered.length) out.editorialSections = filtered;
      continue;
    }

    if (key === "faqHtml" && hasStructuredFaq) continue;

    if (typeof v === "string" && TRIMMABLE_STRING_KEYS.includes(key) && !v.trim()) continue;

    if (key === "faqItems") {
      if (!Array.isArray(v)) continue;
      // Keep any row with a stable id so new “Add FAQ” drafts (empty Q/A) are not stripped before the user types.
      const filtered = v.filter(
        (item) => item && typeof item === "object" && String((item as { id?: string }).id ?? "").trim(),
      );
      if (filtered.length) (out as Record<string, unknown>).faqItems = filtered;
      continue;
    }

    if (hasEditorialSections && !hasFaq && !hasStructuredFaq && (key === "featuresHtml" || key === "bestPracticesHtml" || key === "faqHtml")) {
      continue;
    }

    (out as Record<string, unknown>)[k] = v;
  }
  return Object.keys(out).length ? out : null;
}

/** Merge a patch into one slug’s override and drop the slug if nothing remains. */
export function applyDevToolOverridePatch(
  prev: Record<string, DevToolAdminOverride>,
  slug: string,
  patch: Partial<DevToolAdminOverride>,
): Record<string, DevToolAdminOverride> {
  const merged: DevToolAdminOverride = { ...(prev[slug] ?? {}), ...patch };
  if (patch.faqHtml !== undefined) {
    delete merged.editorialSections;
    delete merged.featuresHtml;
    delete merged.bestPracticesHtml;
    delete merged.faqItems;
  }
  if (patch.faqItems !== undefined) {
    const hasStructured =
      Array.isArray(patch.faqItems) &&
      patch.faqItems.some(
        (it) =>
          (typeof it?.question === "string" && it.question.trim()) ||
          (typeof it?.answerHtml === "string" && it.answerHtml.trim()),
      );
    if (hasStructured) delete merged.faqHtml;
  }
  if (patch.editorialSections !== undefined) {
    delete merged.featuresHtml;
    delete merged.bestPracticesHtml;
    delete merged.faqHtml;
  }
  const next = { ...prev };
  const trimmed = trimEmptyDevToolOverride(merged);
  if (!trimmed) {
    delete next[slug];
    return next;
  }
  next[slug] = trimmed;
  return next;
}
