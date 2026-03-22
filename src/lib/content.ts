import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

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
} as const;

function useKv(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function getKv(): Promise<{ get: (k: string) => Promise<unknown>; set: (k: string, v: unknown) => Promise<unknown> } | null> {
  if (!useKv()) return null;
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
    defaultTitle: "Torq Studio | Senior Software Engineers | Mobile, Web, AI & Consulting",
    defaultDescription:
      "Senior software engineers for hire: mobile apps, websites, AI solutions, and technical consulting. Direct collaboration, production-quality delivery, and honest scoping—worldwide.",
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
    ogTitle: "Torq Studio | Senior Engineers for Mobile, Web & AI",
    ogDescription:
      "Build products or get technical advice—mobile apps, web, AI, and consulting from engineers who still ship.",
    twitterTitle: "Torq Studio | Senior Engineers for Mobile, Web & AI",
    twitterDescription:
      "Mobile, web, AI & technical consulting. Work directly with senior software engineers.",
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
