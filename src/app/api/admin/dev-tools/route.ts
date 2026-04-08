import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  readDevToolsAdminDocument,
  writeDevToolsAdminDocument,
  type DevToolAdminFaqItem,
  type DevToolAdminOverride,
  type DevToolEditorialSection,
  type DevToolsAdminDocument,
} from "@/lib/content";
import { sanitizeDevToolEditorialHtml, sanitizeDevToolSectionTitle } from "@/lib/dev-tool-html-sanitize";
import { sanitizeHubSlugOrderByCategory } from "@/lib/dev-tools-admin";
import { UMBRELLA_TOOLS } from "@/lib/umbrella-tools/tools-config";

const VALID_SLUGS = new Set(UMBRELLA_TOOLS.map((t) => t.slug));
const MAX_NOTES_LEN = 2000;
const MAX_EDITORIAL_HTML = 120_000;
const MAX_EDITORIAL_SECTIONS = 25;
const MAX_SECTION_ID_LEN = 80;
const MAX_FAQ_ITEMS = 40;
const MAX_FAQ_QUESTION_LEN = 400;
const MAX_SEO_TITLE_LEN = 120;
const MAX_SEO_DESC_LEN = 320;

export async function GET() {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const doc = await readDevToolsAdminDocument();
  return NextResponse.json({
    catalog: UMBRELLA_TOOLS.map((t) => ({
      slug: t.slug,
      title: t.title,
      description: t.description,
      category: t.category,
      icon: t.icon,
    })),
    document: doc ?? { overrides: {}, updatedAt: new Date(0).toISOString() },
  });
}

export async function PUT(request: NextRequest) {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await readDevToolsAdminDocument();

  const body = (await request.json().catch(() => null)) as {
    overrides?: Record<string, DevToolAdminOverride>;
    hubSlugOrderByCategory?: unknown;
  } | null;

  if (!body?.overrides || typeof body.overrides !== "object") {
    return NextResponse.json(
      {
        error:
          "Expected { overrides: { [slug]: { enabled?, featured?, notes?, … } }, hubSlugOrderByCategory?: { [category]: slug[] } }",
      },
      { status: 400 },
    );
  }

  const next: Record<string, DevToolAdminOverride> = {};
  for (const [slug, patch] of Object.entries(body.overrides)) {
    if (!VALID_SLUGS.has(slug)) {
      return NextResponse.json({ error: `Unknown tool slug: ${slug}` }, { status: 400 });
    }
    if (patch && typeof patch !== "object") {
      return NextResponse.json({ error: `Invalid override for ${slug}` }, { status: 400 });
    }
    const o: DevToolAdminOverride = {};
    if (typeof patch.enabled === "boolean") o.enabled = patch.enabled;
    if (typeof patch.featured === "boolean") o.featured = patch.featured;
    if (typeof patch.notes === "string") {
      const n = patch.notes.slice(0, MAX_NOTES_LEN);
      if (n.trim()) o.notes = n;
    }
    if (typeof patch.seoTitle === "string") {
      const s = patch.seoTitle.trim().slice(0, MAX_SEO_TITLE_LEN);
      if (s) o.seoTitle = s;
    }
    if (typeof patch.seoDescription === "string") {
      const s = patch.seoDescription.trim().slice(0, MAX_SEO_DESC_LEN);
      if (s) o.seoDescription = s;
    }
    if (Array.isArray(patch.editorialSections)) {
      if (patch.editorialSections.length > MAX_EDITORIAL_SECTIONS) {
        return NextResponse.json(
          { error: `At most ${MAX_EDITORIAL_SECTIONS} editorial sections per tool` },
          { status: 400 },
        );
      }
      const sanitized: DevToolEditorialSection[] = [];
      for (const raw of patch.editorialSections) {
        if (!raw || typeof raw !== "object") continue;
        const id =
          typeof (raw as { id?: unknown }).id === "string"
            ? (raw as { id: string }).id.trim().slice(0, MAX_SECTION_ID_LEN)
            : "";
        if (!id) continue;
        const title = sanitizeDevToolSectionTitle(
          typeof (raw as { title?: unknown }).title === "string" ? (raw as { title: string }).title : "",
        );
        const bodyRaw =
          typeof (raw as { bodyHtml?: unknown }).bodyHtml === "string"
            ? (raw as { bodyHtml: string }).bodyHtml
            : "";
        const bodyHtml = sanitizeDevToolEditorialHtml(bodyRaw).slice(0, MAX_EDITORIAL_HTML);
        if (!title.trim() && !bodyHtml.trim()) continue;
        sanitized.push({ id, title, bodyHtml });
      }
      o.editorialSections = sanitized;
    } else {
      for (const key of ["featuresHtml", "bestPracticesHtml", "faqHtml"] as const) {
        if (typeof patch[key] === "string") {
          const s = sanitizeDevToolEditorialHtml(patch[key]).slice(0, MAX_EDITORIAL_HTML);
          if (s.trim()) o[key] = s;
        }
      }
    }
    if (typeof patch.blogHtml === "string") {
      const s = sanitizeDevToolEditorialHtml(patch.blogHtml).slice(0, MAX_EDITORIAL_HTML);
      if (s.trim()) o.blogHtml = s;
    }
    if (Array.isArray(patch.faqItems)) {
      if (patch.faqItems.length > MAX_FAQ_ITEMS) {
        return NextResponse.json({ error: `At most ${MAX_FAQ_ITEMS} FAQ items per tool` }, { status: 400 });
      }
      const sanitized: DevToolAdminFaqItem[] = [];
      for (const raw of patch.faqItems) {
        if (!raw || typeof raw !== "object") continue;
        const id =
          typeof (raw as { id?: unknown }).id === "string"
            ? (raw as { id: string }).id.trim().slice(0, MAX_SECTION_ID_LEN)
            : "";
        if (!id) continue;
        let question =
          typeof (raw as { question?: unknown }).question === "string" ? (raw as { question: string }).question : "";
        question = sanitizeDevToolSectionTitle(question).slice(0, MAX_FAQ_QUESTION_LEN);
        const bodyRaw =
          typeof (raw as { answerHtml?: unknown }).answerHtml === "string"
            ? (raw as { answerHtml: string }).answerHtml
            : "";
        const answerHtml = sanitizeDevToolEditorialHtml(bodyRaw).slice(0, MAX_EDITORIAL_HTML);
        if (!question.trim() && !answerHtml.trim()) continue;
        sanitized.push({ id, question, answerHtml });
      }
      if (sanitized.length) o.faqItems = sanitized;
    }
    if (o.faqItems && o.faqItems.length > 0) {
      delete o.faqHtml;
    }
    if (Object.keys(o).length) next[slug] = o;
  }

  let hubSlugOrderByCategory = existing?.hubSlugOrderByCategory;
  if (body && "hubSlugOrderByCategory" in body) {
    const sanitized = sanitizeHubSlugOrderByCategory(body.hubSlugOrderByCategory);
    if (sanitized === undefined) {
      hubSlugOrderByCategory = existing?.hubSlugOrderByCategory;
    } else if (Object.keys(sanitized).length === 0) {
      hubSlugOrderByCategory = undefined;
    } else {
      hubSlugOrderByCategory = sanitized;
    }
  }

  const document: DevToolsAdminDocument = {
    overrides: next,
    ...(hubSlugOrderByCategory ? { hubSlugOrderByCategory } : {}),
    updatedAt: new Date().toISOString(),
  };
  await writeDevToolsAdminDocument(document);

  revalidatePath("/dev-tools");
  revalidatePath("/dev-tools", "layout");
  revalidatePath("/admin/dev-tools");
  for (const t of UMBRELLA_TOOLS) {
    revalidatePath(`/dev-tools/${t.slug}`);
  }
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ document });
}
