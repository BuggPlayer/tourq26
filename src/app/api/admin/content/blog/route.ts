import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { readBlogPosts, writeBlogPosts, type BlogPost } from "@/lib/content";

export async function GET() {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const posts = await readBlogPosts();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as Partial<BlogPost>;
  const posts = await readBlogPosts();
  const slug =
    body.slug?.replace(/\s+/g, "-").toLowerCase() ||
    body.title?.replace(/\s+/g, "-").toLowerCase() ||
    `post-${Date.now()}`;
  if (posts.some((p) => p.slug === slug)) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
  }
  const newPost: BlogPost = {
    slug,
    title: body.title ?? "Untitled",
    description: body.description ?? "",
    date: body.date ?? new Date().toISOString().slice(0, 10),
    readTime: body.readTime ?? "5 min read",
    body: body.body ?? "",
    ...(typeof body.authorName === "string" && body.authorName.trim()
      ? { authorName: body.authorName.trim() }
      : {}),
  };
  posts.push(newPost);
  await writeBlogPosts(posts);
  revalidatePath("/blog");
  revalidatePath(`/blog/${newPost.slug}`);
  return NextResponse.json(newPost);
}
