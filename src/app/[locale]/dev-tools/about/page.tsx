import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import { DevToolsAboutArticle } from "@/components/umbrella-tools/DevToolsAboutArticle";
import { readDevToolsAdminDocument } from "@/lib/content";
import { getDevToolsNavCatalogSorted } from "@/lib/dev-tools-admin";
import { pathSegmentToLocale } from "@/lib/dev-tools-locale-path";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { devToolsAboutMetadata } from "@/lib/umbrella-tools/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: segment } = await params;
  const locale = pathSegmentToLocale(segment);
  if (!locale) return { title: "About" };
  return devToolsAboutMetadata(locale);
}

export default async function DevToolsPrefixedAboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: segment } = await params;
  if (!pathSegmentToLocale(segment)) notFound();

  const adminDoc = await readDevToolsAdminDocument();
  const playgroundOn = await isFeatureEnabled("dev_tools_code_playground");
  const navCatalogTools = getDevToolsNavCatalogSorted(adminDoc, playgroundOn);

  return (
    <UmbrellaToolsLayout catalogTools={navCatalogTools}>
      <DevToolsAboutArticle />
    </UmbrellaToolsLayout>
  );
}
