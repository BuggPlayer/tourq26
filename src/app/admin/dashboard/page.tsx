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
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Manage your site content.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/contact"
          className="rounded-xl border border-border/50 bg-muted/30 p-6 transition hover:border-primary/50 hover:bg-muted/50"
        >
          <h2 className="font-semibold text-foreground">Contact</h2>
          <p className="mt-1 text-2xl font-bold text-primary">{contactSubmissions.length}</p>
          <p className="mt-1 text-sm text-muted-foreground">submissions</p>
        </Link>
        <Link
          href="/admin/blog"
          className="rounded-xl border border-border/50 bg-muted/30 p-6 transition hover:border-primary/50 hover:bg-muted/50"
        >
          <h2 className="font-semibold text-foreground">Blog</h2>
          <p className="mt-1 text-2xl font-bold text-primary">{posts.length}</p>
          <p className="mt-1 text-sm text-muted-foreground">posts</p>
        </Link>
        <Link
          href="/admin/testimonials"
          className="rounded-xl border border-border/50 bg-muted/30 p-6 transition hover:border-primary/50 hover:bg-muted/50"
        >
          <h2 className="font-semibold text-foreground">Testimonials</h2>
          <p className="mt-1 text-2xl font-bold text-primary">{testimonials.length}</p>
          <p className="mt-1 text-sm text-muted-foreground">testimonials</p>
        </Link>
        <Link
          href="/admin/site"
          className="rounded-xl border border-border/50 bg-muted/30 p-6 transition hover:border-primary/50 hover:bg-muted/50"
        >
          <h2 className="font-semibold text-foreground">Site & SEO</h2>
          <p className="mt-1 text-sm text-muted-foreground">Default title, description, OG</p>
        </Link>
        <Link
          href="/admin/feature-flags"
          className="rounded-xl border border-border/50 bg-muted/30 p-6 transition hover:border-primary/50 hover:bg-muted/50"
        >
          <h2 className="font-semibold text-foreground">Feature flags</h2>
          <p className="mt-1 text-sm text-muted-foreground">Maintenance, marketing routes, and nav toggles</p>
        </Link>
        <Link
          href="/admin/dev-tools"
          className="rounded-xl border border-border/50 bg-muted/30 p-6 transition hover:border-primary/50 hover:bg-muted/50"
        >
          <h2 className="font-semibold text-foreground">Dev tools</h2>
          <p className="mt-1 text-sm text-muted-foreground">Enable or hide tools, notes, featured flags</p>
        </Link>
      </div>
      <div className="mt-8 rounded-xl border border-border/50 bg-muted/30 p-6">
        <h2 className="font-semibold text-foreground">Storage</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {kvConfigured
            ? "Using Vercel KV / Upstash Redis. Content persists on serverless."
            : "Using local files (content/*.json). On Vercel, add KV/Redis and set env to persist."}
        </p>
        {kvConfigured && (
          <SeedKvButton className="mt-3 rounded bg-muted px-3 py-1.5 text-sm text-foreground hover:bg-muted" />
        )}
      </div>
    </div>
  );
}
