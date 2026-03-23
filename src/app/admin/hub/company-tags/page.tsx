import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";
import { CompanyTagsClient } from "./CompanyTagsClient";

export default async function AdminCompanyTagsPage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  const tags = await prisma.companyTag.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Company tags</h1>
      <p className="mt-1 text-slate-400">Used when linking questions to companies (FAANG, unicorns, …).</p>
      <CompanyTagsClient initialTags={tags} />
    </div>
  );
}
