import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { readBlogPosts } from "@/lib/content";
import { BlogPostForm } from "../../BlogPostForm";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  const { slug } = await params;
  const posts = await readBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div>
      <Link href="/admin/blog" className="text-sm text-slate-400 hover:text-white">
        ← Blog
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-white">Edit post</h1>
      <BlogPostForm key={post.slug} post={post} />
    </div>
  );
}
