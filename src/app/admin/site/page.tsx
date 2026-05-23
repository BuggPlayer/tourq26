import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { readSiteContent } from "@/lib/content";
import { SiteForm } from "./SiteForm";
import { AdminPageHeader } from "../AdminPageHeader";

export default async function AdminSitePage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  const data = await readSiteContent();

  return (
    <div>
      <AdminPageHeader
        crumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Site & SEO" },
        ]}
        title="Site & SEO"
        description="Global metadata: default title and description, page title template, Open Graph, X/Twitter Card, keywords, and social URLs."
      />
      <SiteForm initialData={data} />
    </div>
  );
}
