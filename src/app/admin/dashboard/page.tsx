import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { readBlogPosts, readTestimonials, readContactSubmissions } from "@/lib/content";
import { SeedKvButton } from "./SeedKvButton";

const kvConfigured = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

export default async function AdminDashboardPage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  const [posts, testimonials, contactSubmissions] = await Promise.all([
    readBlogPosts(),
    readTestimonials(),
    readContactSubmissions(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <p className="mt-1 text-slate-400">Manage your site content.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/contact"
          className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 transition hover:border-cyan-500/50 hover:bg-slate-800/50"
        >
          <h2 className="font-semibold text-white">Contact</h2>
          <p className="mt-1 text-2xl font-bold text-cyan-400">{contactSubmissions.length}</p>
          <p className="mt-1 text-sm text-slate-400">submissions</p>
        </Link>
        <Link
          href="/admin/blog"
          className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 transition hover:border-cyan-500/50 hover:bg-slate-800/50"
        >
          <h2 className="font-semibold text-white">Blog</h2>
          <p className="mt-1 text-2xl font-bold text-cyan-400">{posts.length}</p>
          <p className="mt-1 text-sm text-slate-400">posts</p>
        </Link>
        <Link
          href="/admin/testimonials"
          className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 transition hover:border-cyan-500/50 hover:bg-slate-800/50"
        >
          <h2 className="font-semibold text-white">Testimonials</h2>
          <p className="mt-1 text-2xl font-bold text-cyan-400">{testimonials.length}</p>
          <p className="mt-1 text-sm text-slate-400">testimonials</p>
        </Link>
        <Link
          href="/admin/site"
          className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 transition hover:border-cyan-500/50 hover:bg-slate-800/50"
        >
          <h2 className="font-semibold text-white">Site & SEO</h2>
          <p className="mt-1 text-sm text-slate-400">Default title, description, OG</p>
        </Link>
      </div>
      <div className="mt-8 rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
        <h2 className="font-semibold text-white">Storage</h2>
        <p className="mt-1 text-sm text-slate-400">
          {kvConfigured
            ? "Using Vercel KV / Upstash Redis. Content persists on serverless."
            : "Using local files (content/*.json). On Vercel, add KV/Redis and set env to persist."}
        </p>
        {kvConfigured && (
          <SeedKvButton className="mt-3 rounded bg-slate-700 px-3 py-1.5 text-sm text-white hover:bg-slate-600" />
        )}
      </div>
    </div>
  );
}
