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
      <p className="mt-1 text-muted-foreground">
        Default metadata and Open Graph. Root layout uses these where applicable; some defaults are in code.
      </p>
      <SiteForm initialData={data} />
    </div>
  );
}
