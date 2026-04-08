import type { DevToolsAdminDocument } from "@/lib/content";
import type { DevToolCategory } from "@/lib/umbrella-tools/types";
import type { UmbrellaTool } from "@/lib/umbrella-tools/tools-config";
import {
  CODE_PLAYGROUND_SLUG,
  DEV_TOOL_CATEGORY_ORDER,
  filterCodePlaygroundFromCatalog,
  getRelatedDevTools,
  getDevToolBySlug,
  UMBRELLA_TOOLS,
} from "@/lib/umbrella-tools/tools-config";

/**
 * Merge admin-stored SEO overrides onto the registry tool (after static `seo-overrides.ts`).
 * Non-empty `seoTitle` / `seoDescription` in admin replace registry values for metadata & JSON-LD.
 */
export function applyDevToolAdminSeoToTool(tool: UmbrellaTool, doc: DevToolsAdminDocument | null): UmbrellaTool {
  const o = doc?.overrides?.[tool.slug];
  if (!o) return tool;
  const seoTitle = o.seoTitle?.trim();
  const seoDescription = o.seoDescription?.trim();
  if (!seoTitle && !seoDescription) return tool;
  return {
    ...tool,
    ...(seoTitle ? { seoTitle } : {}),
    ...(seoDescription ? { seoDescription } : {}),
  };
}

/** Registry tool with admin SEO merged — for metadata and structured data. */
export function getDevToolBySlugWithAdminSeo(slug: string, doc: DevToolsAdminDocument | null): UmbrellaTool | undefined {
  const tool = getDevToolBySlug(slug);
  if (!tool) return undefined;
  return applyDevToolAdminSeoToTool(tool, doc);
}

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

/** Sidebar / mobile nav: enabled tools only, respecting code-playground feature flag. */
export function getDevToolsNavCatalogTools(
  doc: DevToolsAdminDocument | null,
  codePlaygroundEnabled: boolean,
): UmbrellaTool[] {
  return filterUmbrellaToolsByAdmin(filterCodePlaygroundFromCatalog(UMBRELLA_TOOLS, codePlaygroundEnabled), doc);
}

const VALID_CATEGORY = new Set<string>(DEV_TOOL_CATEGORY_ORDER);

function registrySlugsForCategory(category: DevToolCategory): string[] {
  return UMBRELLA_TOOLS.filter((t) => t.category === category).map((t) => t.slug);
}

/** Merge saved order with registry: unknown slugs dropped; new registry slugs appended. */
export function resolveHubSlugOrderForCategory(
  category: DevToolCategory,
  doc: DevToolsAdminDocument | null,
): string[] {
  const registry = registrySlugsForCategory(category);
  const saved = doc?.hubSlugOrderByCategory?.[category];
  if (!saved?.length) return registry;
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const s of saved) {
    if (registry.includes(s) && !seen.has(s)) {
      ordered.push(s);
      seen.add(s);
    }
  }
  for (const s of registry) {
    if (!seen.has(s)) ordered.push(s);
  }
  return ordered;
}

/**
 * Flat nav tool list: category order matches the hub, and tools within each category match hub sort
 * (featured first, then admin order, then title).
 */
export function getDevToolsNavCatalogSorted(
  doc: DevToolsAdminDocument | null,
  codePlaygroundEnabled: boolean,
): UmbrellaTool[] {
  const raw = getDevToolsNavCatalogTools(doc, codePlaygroundEnabled);
  const bySlug = new Map(raw.map((t) => [t.slug, t]));
  const out: UmbrellaTool[] = [];
  for (const category of DEV_TOOL_CATEGORY_ORDER) {
    const slugs = resolveHubSlugOrderForCategory(category, doc).filter((s) => bySlug.has(s));
    const chunk = slugs.map((s) => bySlug.get(s)!);
    if (chunk.length) out.push(...sortUmbrellaToolsForHub(chunk, doc));
  }
  return out;
}

/**
 * Sanitize admin JSON for `hubSlugOrderByCategory`. Returns `{}` when input is an empty object;
 * `undefined` when the payload should be ignored (invalid type).
 */
export function sanitizeHubSlugOrderByCategory(
  raw: unknown,
): Partial<Record<DevToolCategory, string[]>> | undefined {
  if (raw === undefined) return undefined;
  if (raw === null) return {};
  if (typeof raw !== "object" || Array.isArray(raw)) return undefined;

  const allowedSlugsByCat = new Map<DevToolCategory, Set<string>>();
  for (const t of UMBRELLA_TOOLS) {
    if (!allowedSlugsByCat.has(t.category)) allowedSlugsByCat.set(t.category, new Set());
    allowedSlugsByCat.get(t.category)!.add(t.slug);
  }

  const out: Partial<Record<DevToolCategory, string[]>> = {};
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    if (!VALID_CATEGORY.has(key)) continue;
    const category = key as DevToolCategory;
    if (!Array.isArray(val)) continue;
    const allowed = allowedSlugsByCat.get(category);
    if (!allowed?.size) continue;
    const seen = new Set<string>();
    const list: string[] = [];
    for (const item of val) {
      if (typeof item !== "string" || !allowed.has(item) || seen.has(item)) continue;
      seen.add(item);
      list.push(item);
    }
    for (const s of allowed) {
      if (!seen.has(s)) list.push(s);
    }
    out[category] = list;
  }
  return out;
}

export function getRelatedDevToolsFiltered(
  slug: string,
  limit: number,
  doc: DevToolsAdminDocument | null,
  opts?: { codePlaygroundEnabled?: boolean },
): UmbrellaTool[] {
  const raw = filterUmbrellaToolsByAdmin(getRelatedDevTools(slug, limit * 2), doc).slice(0, limit);
  if (opts?.codePlaygroundEnabled === false) {
    return raw.filter((t) => t.slug !== CODE_PLAYGROUND_SLUG);
  }
  return raw;
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

/**
 * Within one category: featured first, then admin hub order (when set), then title.
 * Callers should pass tools that all share the same `category`.
 */
export function sortUmbrellaToolsForHub(tools: UmbrellaTool[], doc: DevToolsAdminDocument | null): UmbrellaTool[] {
  if (tools.length === 0) return tools;
  const category = tools[0].category;
  const orderSlugs = resolveHubSlugOrderForCategory(category, doc);
  const index = new Map(orderSlugs.map((s, i) => [s, i]));
  return [...tools].sort((a, b) => {
    const fa = isDevToolFeatured(a.slug, doc) ? 1 : 0;
    const fb = isDevToolFeatured(b.slug, doc) ? 1 : 0;
    if (fb !== fa) return fb - fa;
    const ia = index.get(a.slug);
    const ib = index.get(b.slug);
    if (ia !== undefined && ib !== undefined && ia !== ib) return ia - ib;
    if (ia !== undefined && ib === undefined) return -1;
    if (ia === undefined && ib !== undefined) return 1;
    return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
  });
}
