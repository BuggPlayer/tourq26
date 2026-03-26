import type { DevToolAdminOverride } from "@/lib/content";

const TRIMMABLE_STRING_KEYS: (keyof DevToolAdminOverride)[] = ["notes", "featuresHtml", "bestPracticesHtml", "faqHtml"];

function trimEmptyDevToolOverride(o: DevToolAdminOverride): DevToolAdminOverride | null {
  const out: DevToolAdminOverride = {};
  const hasEditorialSections = Array.isArray(o.editorialSections) && o.editorialSections.length > 0;
  const hasFaq = typeof o.faqHtml === "string" && o.faqHtml.trim().length > 0;

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

    if (typeof v === "string" && TRIMMABLE_STRING_KEYS.includes(key) && !v.trim()) continue;

    if (hasEditorialSections && !hasFaq && (key === "featuresHtml" || key === "bestPracticesHtml" || key === "faqHtml")) {
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
