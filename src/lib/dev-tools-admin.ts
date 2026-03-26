import type { DevToolsAdminDocument } from "@/lib/content";
import type { UmbrellaTool } from "@/lib/umbrella-tools/tools-config";
import { getRelatedDevTools, UMBRELLA_TOOLS } from "@/lib/umbrella-tools/tools-config";

/** Whether a tool is publicly accessible (default true). */
export function isDevToolEnabled(slug: string, doc: DevToolsAdminDocument | null): boolean {
  const o = doc?.overrides?.[slug];
  if (!o) return true;
  return o.enabled !== false;
}

export function getEnabledSlugs(doc: DevToolsAdminDocument | null): Set<string> {
  const all = new Set(UMBRELLA_TOOLS.map((t) => t.slug));
  if (!doc?.overrides) return all;
  const out = new Set<string>();
  for (const t of UMBRELLA_TOOLS) {
    if (isDevToolEnabled(t.slug, doc)) out.add(t.slug);
  }
  return out;
}

export function filterUmbrellaToolsByAdmin(tools: UmbrellaTool[], doc: DevToolsAdminDocument | null): UmbrellaTool[] {
  return tools.filter((t) => isDevToolEnabled(t.slug, doc));
}

export function getRelatedDevToolsFiltered(
  slug: string,
  limit: number,
  doc: DevToolsAdminDocument | null,
): UmbrellaTool[] {
  return filterUmbrellaToolsByAdmin(getRelatedDevTools(slug, limit * 2), doc).slice(0, limit);
}

export function countEnabledTools(doc: DevToolsAdminDocument | null): number {
  return UMBRELLA_TOOLS.filter((t) => isDevToolEnabled(t.slug, doc)).length;
}

export function countDisabledTools(doc: DevToolsAdminDocument | null): number {
  return UMBRELLA_TOOLS.length - countEnabledTools(doc);
}

/** Hub: admin can mark tools as featured (badge + listed first within each category). */
export function isDevToolFeatured(slug: string, doc: DevToolsAdminDocument | null): boolean {
  return doc?.overrides?.[slug]?.featured === true;
}

/** Featured tools first, then alphabetical by title within the same category block. */
export function sortUmbrellaToolsForHub(tools: UmbrellaTool[], doc: DevToolsAdminDocument | null): UmbrellaTool[] {
  return [...tools].sort((a, b) => {
    const fa = isDevToolFeatured(a.slug, doc) ? 1 : 0;
    const fb = isDevToolFeatured(b.slug, doc) ? 1 : 0;
    if (fb !== fa) return fb - fa;
    return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
  });
}
