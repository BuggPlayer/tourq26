import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { readBlogPosts, writeBlogPosts, type BlogPost } from "@/lib/content";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const posts = await readBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const body = (await request.json()) as Partial<BlogPost>;
  const posts = await readBlogPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const updated: BlogPost = {
    ...posts[index],
    ...body,
    slug: body.slug ?? posts[index].slug,
    title: body.title ?? posts[index].title,
    description: body.description ?? posts[index].description,
    date: body.date ?? posts[index].date,
    readTime: body.readTime ?? posts[index].readTime,
    body: body.body ?? posts[index].body,
  };
  posts[index] = updated;
  await writeBlogPosts(posts);
  revalidatePath("/blog");
  revalidatePath(`/blog/${updated.slug}`);
  if (updated.slug !== slug) revalidatePath(`/blog/${slug}`);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const posts = await readBlogPosts();
  const filtered = posts.filter((p) => p.slug !== slug);
  if (filtered.length === posts.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await writeBlogPosts(filtered);
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return NextResponse.json({ ok: true });
}
