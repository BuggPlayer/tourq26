import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  readBlogPostsFromFile,
  readTestimonialsFromFile,
  readSiteContentFromFile,
  writeBlogPosts,
  writeTestimonials,
  writeSiteContent,
} from "@/lib/content";

/**
 * One-time seed: copy file-based content into Vercel KV.
 * Call this once after enabling KV (e.g. on first Vercel deploy) to migrate content from content/*.json into KV.
 * Requires admin session.
 */
export async function POST() {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return NextResponse.json(
      { error: "KV not configured. Set KV_REST_API_URL and KV_REST_API_TOKEN." },
      { status: 400 }
    );
  }

  try {
    const [posts, testimonials, site] = await Promise.all([
      readBlogPostsFromFile(),
      readTestimonialsFromFile(),
      readSiteContentFromFile(),
    ]);
    await writeBlogPosts(posts);
    await writeTestimonials(testimonials);
    await writeSiteContent(site);
    return NextResponse.json({
      ok: true,
      message: "Content seeded to KV",
      blog: posts.length,
      testimonials: testimonials.length,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Seed failed" },
      { status: 500 }
    );
  }
}
