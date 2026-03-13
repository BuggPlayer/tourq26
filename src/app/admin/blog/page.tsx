import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { readBlogPosts } from "@/lib/content";
import { BlogListActions } from "./BlogListActions";

export default async function AdminBlogPage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  const posts = await readBlogPosts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
        >
          New post
        </Link>
      </div>
      <p className="mt-1 text-slate-400">Edit or delete posts. Changes appear on the site after save.</p>
      <ul className="mt-6 space-y-3">
        {posts.length === 0 ? (
          <li className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-6 text-center text-slate-400">
            No posts yet. Create one above.
          </li>
        ) : (
          posts.map((post) => (
            <li
              key={post.slug}
              className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/30 px-4 py-3"
            >
              <div>
                <span className="font-medium text-white">{post.title}</span>
                <span className="ml-2 text-sm text-slate-500">/{post.slug}</span>
              </div>
              <BlogListActions slug={post.slug} />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
