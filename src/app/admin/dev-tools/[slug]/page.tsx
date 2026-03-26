import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { readDevToolsAdminDocument } from "@/lib/content";
import { DevToolAdminDetailPanel } from "../DevToolAdminDetailPanel";
import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

export default async function AdminDevToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  const { slug } = await params;
  const tool = getDevToolBySlug(slug);
  if (!tool) notFound();

  const doc = await readDevToolsAdminDocument();

  return (
    <DevToolAdminDetailPanel
      slug={slug}
      tool={tool}
      initialOverrides={doc?.overrides ?? {}}
      initialUpdatedAt={doc?.updatedAt ?? ""}
    />
  );
}
