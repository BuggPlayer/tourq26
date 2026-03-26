import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { readSiteContent } from "@/lib/content";
import { SiteForm } from "./SiteForm";

export default async function AdminSitePage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  const data = await readSiteContent();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Site & SEO</h1>
      <p className="mt-1 max-w-2xl text-muted-foreground">
        Edit global meta: default title and description, page title template, Open Graph, X/Twitter Card text, keywords,
        and social URLs. Changes apply to the root layout, shared defaults, and cache after save (KV in production,{" "}
        <code className="rounded bg-muted px-1 font-mono text-xs">content/site.json</code> locally).
      </p>
      <SiteForm initialData={data} />
    </div>
  );
}
