import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { FEATURE_FLAGS_KV_KEY } from "@/lib/feature-flags-constants";
import type { DevToolCategory } from "@/lib/umbrella-tools/types";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  body: string;
  /** Optional author display name for E-E-A-T / Article schema */
  authorName?: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  result: string;
  name: string;
  role: string;
  company: string;
  rating: number;
};

export type SiteContent = {
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  titleTemplate: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  siteName: string;
  /** Social profile URLs for Organization sameAs (LinkedIn, X, etc.) */
  sameAs: string[];
  /** X/Twitter handle without @ (e.g. torqstudio) */
  twitterSite: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  createdAt: string; // ISO
};

const KV_KEYS = {
  blog: "content:blog",
  testimonials: "content:testimonials",
  site: "content:site",
  contact: "content:contact",
  featureFlags: FEATURE_FLAGS_KV_KEY,
  devToolsAdmin: "content:dev-tools-admin",
} as const;

export type FeatureFlagsDocument = {
  values: Record<string, boolean>;
  updatedAt: string;
};

/** Admin-managed visibility and notes per dev-tool slug (merged with code registry at runtime). */
export type DevToolAdminOverride = {
  /** When false, tool is hidden from hub, related tools, and sitemap; the URL returns 404. Default true. */
  enabled?: boolean;
  /** When true, tool shows a Featured badge on the hub and sorts first within its category. */
  featured?: boolean;
  /** Internal notes for operators only (not shown publicly). */
  notes?: string;
  /**
   * Dynamic titled sections (rich HTML per block). Preferred over legacy fields below.
   * Order is preserved for the public tool page.
   */
  editorialSections?: DevToolEditorialSection[];
  /** @deprecated Use `editorialSections`; still read for migration. */
  featuresHtml?: string;
  /** @deprecated Use `editorialSections`. */
  bestPracticesHtml?: string;
  /** @deprecated Use `faqItems` or legacy migration; still read for display. */
  faqHtml?: string;
  /** Long-form guide / blog-style copy below the tool (sanitized rich HTML). Shown in an accordion panel. */
  blogHtml?: string;
  /** Operator-authored FAQ accordion; preferred over `faqHtml` for display and FAQ schema. */
  faqItems?: DevToolAdminFaqItem[];
  /** Override `<title>` / Open Graph title segment (merged with site title template). Empty = use registry. */
  seoTitle?: string;
  /** Override meta description and OG/Twitter description tail. Empty = use registry + category default. */
  seoDescription?: string;
};

/** One admin-authored section below the tool UI (title + Quill HTML body). */
export type DevToolEditorialSection = {
  id: string;
  title: string;
  bodyHtml: string;
};

/** Structured FAQ row for accordion UI + FAQPage JSON-LD (answers are sanitized HTML). */
export type DevToolAdminFaqItem = {
  id: string;
  question: string;
  answerHtml: string;
};

export type DevToolsAdminDocument = {
  overrides: Record<string, DevToolAdminOverride>;
  /**
   * Optional per-category slug order for the public hub and dev-tools sidebar (registry slugs only).
   * Omitted categories follow code registry order within that category.
   */
  hubSlugOrderByCategory?: Partial<Record<DevToolCategory, string[]>>;
  updatedAt: string;
};

function isVercelKvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function getKv(): Promise<{ get: (k: string) => Promise<unknown>; set: (k: string, v: unknown) => Promise<unknown> } | null> {
  if (!isVercelKvConfigured()) return null;
  try {
    const { kv } = await import("@vercel/kv");
    return kv;
  } catch {
    return null;
  }
}

const CONTENT_DIR = path.join(process.cwd(), "content");

async function getContentPath(filename: string): Promise<string> {
  await mkdir(CONTENT_DIR, { recursive: true });
  return path.join(CONTENT_DIR, filename);
}

export async function readFeatureFlagsDocument(): Promise<FeatureFlagsDocument | null> {
  const kv = await getKv();
  if (kv) {
    const data = await kv.get(KV_KEYS.featureFlags);
    if (data && typeof data === "object" && data !== null && "values" in data) {
      return data as FeatureFlagsDocument;
    }
    return null;
  }
  try {
    const filePath = await getContentPath("feature-flags.json");
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as FeatureFlagsDocument;
  } catch {
    return null;
  }
}

export async function writeFeatureFlagsDocument(doc: FeatureFlagsDocument): Promise<void> {
  const kv = await getKv();
  if (kv) {
    await kv.set(KV_KEYS.featureFlags, doc);
    return;
  }
  const filePath = await getContentPath("feature-flags.json");
  await writeFile(filePath, JSON.stringify(doc, null, 2), "utf-8");
}

export async function readDevToolsAdminDocument(): Promise<DevToolsAdminDocument | null> {
  const kv = await getKv();
  if (kv) {
    const data = await kv.get(KV_KEYS.devToolsAdmin);
    if (data && typeof data === "object" && data !== null && "overrides" in data) {
      return data as DevToolsAdminDocument;
    }
    return null;
  }
  try {
    const filePath = await getContentPath("dev-tools-admin.json");
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as DevToolsAdminDocument;
  } catch {
    return null;
  }
}

export async function writeDevToolsAdminDocument(doc: DevToolsAdminDocument): Promise<void> {
  const kv = await getKv();
  if (kv) {
    await kv.set(KV_KEYS.devToolsAdmin, doc);
    return;
  }
  const filePath = await getContentPath("dev-tools-admin.json");
  await writeFile(filePath, JSON.stringify(doc, null, 2), "utf-8");
}

export async function readBlogPostsFromFile(): Promise<BlogPost[]> {
  try {
    const filePath = await getContentPath("blog.json");
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function readBlogPosts(): Promise<BlogPost[]> {
  const kv = await getKv();
  if (kv) {
    const data = await kv.get(KV_KEYS.blog);
    return Array.isArray(data) ? (data as BlogPost[]) : [];
  }
  return readBlogPostsFromFile();
}

export async function writeBlogPosts(posts: BlogPost[]): Promise<void> {
  const kv = await getKv();
  if (kv) {
    await kv.set(KV_KEYS.blog, posts);
    return;
  }
  const filePath = await getContentPath("blog.json");
  await writeFile(filePath, JSON.stringify(posts, null, 2), "utf-8");
}

export async function readTestimonialsFromFile(): Promise<Testimonial[]> {
  try {
    const filePath = await getContentPath("testimonials.json");
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function readTestimonials(): Promise<Testimonial[]> {
  const kv = await getKv();
  if (kv) {
    const data = await kv.get(KV_KEYS.testimonials);
    return Array.isArray(data) ? (data as Testimonial[]) : [];
  }
  return readTestimonialsFromFile();
}

export async function writeTestimonials(items: Testimonial[]): Promise<void> {
  const kv = await getKv();
  if (kv) {
    await kv.set(KV_KEYS.testimonials, items);
    return;
  }
  const filePath = await getContentPath("testimonials.json");
  await writeFile(filePath, JSON.stringify(items, null, 2), "utf-8");
}

function getDefaultSiteContent(): SiteContent {
  return {
    siteUrl: "https://torqstudio.com",
    defaultTitle: "Torq Studio | Senior engineers · Mobile, web & AI",
    defaultDescription:
      "Senior software engineers for mobile apps, websites, and AI. Direct collaboration, production-quality delivery, and honest scoping for teams worldwide.",
    titleTemplate: "%s | Torq Studio",
    keywords: [
      "senior software engineer",
      "software consultant",
      "mobile app development",
      "web development",
      "website development",
      "AI integration",
      "technical consulting",
      "freelance developer",
      "remote developer",
      "Torq Studio",
    ],
    ogTitle: "Torq Studio | Senior engineers · Mobile, web & AI",
    ogDescription:
      "Mobile apps, web, AI, and consulting from senior engineers who ship. Clear scope and direct collaboration.",
    twitterTitle: "Torq Studio | Senior engineers · Mobile, web & AI",
    twitterDescription:
      "Senior engineers for mobile, web & AI. Direct collaboration and production-quality delivery.",
    siteName: "Torq Studio",
    sameAs: [],
    twitterSite: "",
  };
}

function normalizeSiteContent(raw: Partial<SiteContent> & Record<string, unknown>): SiteContent {
  const d = getDefaultSiteContent();
  const sameAsRaw = raw.sameAs;
  const sameAs =
    Array.isArray(sameAsRaw) && sameAsRaw.every((x) => typeof x === "string")
      ? (sameAsRaw as string[]).map((u) => u.trim()).filter(Boolean)
      : d.sameAs;
  const tw =
    typeof raw.twitterSite === "string"
      ? raw.twitterSite.replace(/^@/, "").trim()
      : d.twitterSite;
  return {
    siteUrl: typeof raw.siteUrl === "string" && raw.siteUrl.trim() ? raw.siteUrl.trim() : d.siteUrl,
    defaultTitle: typeof raw.defaultTitle === "string" ? raw.defaultTitle : d.defaultTitle,
    defaultDescription: typeof raw.defaultDescription === "string" ? raw.defaultDescription : d.defaultDescription,
    titleTemplate: typeof raw.titleTemplate === "string" ? raw.titleTemplate : d.titleTemplate,
    keywords: Array.isArray(raw.keywords) ? (raw.keywords as string[]).filter((k) => typeof k === "string") : d.keywords,
    ogTitle: typeof raw.ogTitle === "string" ? raw.ogTitle : d.ogTitle,
    ogDescription: typeof raw.ogDescription === "string" ? raw.ogDescription : d.ogDescription,
    twitterTitle: typeof raw.twitterTitle === "string" ? raw.twitterTitle : d.twitterTitle,
    twitterDescription: typeof raw.twitterDescription === "string" ? raw.twitterDescription : d.twitterDescription,
    siteName: typeof raw.siteName === "string" ? raw.siteName : d.siteName,
    sameAs,
    twitterSite: tw,
  };
}

export async function readSiteContentFromFile(): Promise<SiteContent> {
  try {
    const filePath = await getContentPath("site.json");
    const raw = await readFile(filePath, "utf-8");
    return normalizeSiteContent(JSON.parse(raw) as Partial<SiteContent>);
  } catch {
    return getDefaultSiteContent();
  }
}

export async function readSiteContent(): Promise<SiteContent> {
  const kv = await getKv();
  if (kv) {
    const data = await kv.get(KV_KEYS.site);
    if (data && typeof data === "object" && "siteUrl" in data) {
      return normalizeSiteContent(data as Partial<SiteContent>);
    }
    return getDefaultSiteContent();
  }
  return readSiteContentFromFile();
}

export async function writeSiteContent(data: SiteContent): Promise<void> {
  const kv = await getKv();
  if (kv) {
    await kv.set(KV_KEYS.site, data);
    return;
  }
  const filePath = await getContentPath("site.json");
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// --- Contact form submissions (append-only, admin view only) ---

export async function readContactSubmissionsFromFile(): Promise<ContactSubmission[]> {
  try {
    const filePath = await getContentPath("contact.json");
    const raw = await readFile(filePath, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? (data as ContactSubmission[]) : [];
  } catch {
    return [];
  }
}

export async function readContactSubmissions(): Promise<ContactSubmission[]> {
  const kv = await getKv();
  if (kv) {
    const data = await kv.get(KV_KEYS.contact);
    if (Array.isArray(data)) return data as ContactSubmission[];
    return [];
  }
  return readContactSubmissionsFromFile();
}

export async function writeContactSubmissions(submissions: ContactSubmission[]): Promise<void> {
  const kv = await getKv();
  if (kv) {
    await kv.set(KV_KEYS.contact, submissions);
    return;
  }
  const filePath = await getContentPath("contact.json");
  await writeFile(filePath, JSON.stringify(submissions, null, 2), "utf-8");
}

export async function addContactSubmission(input: {
  name: string;
  email: string;
  company?: string;
  message: string;
}): Promise<ContactSubmission> {
  const list = await readContactSubmissions();
  const submission: ContactSubmission = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email: input.email.trim(),
    company: (input.company ?? "").trim(),
    message: input.message.trim(),
    createdAt: new Date().toISOString(),
  };
  list.unshift(submission); // newest first
  await writeContactSubmissions(list);
  return submission;
}
