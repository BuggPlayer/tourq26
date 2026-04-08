import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import { DevToolsAboutArticle } from "@/components/umbrella-tools/DevToolsAboutArticle";
import { readDevToolsAdminDocument } from "@/lib/content";
import { getDevToolsNavCatalogSorted } from "@/lib/dev-tools-admin";
import { getDevToolsLocaleFromCookie } from "@/lib/dev-tools-locale-server";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { devToolsAboutMetadata } from "@/lib/umbrella-tools/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getDevToolsLocaleFromCookie();
  return devToolsAboutMetadata(locale);
}

export default async function DevToolsAboutPage() {
  const adminDoc = await readDevToolsAdminDocument();
  const playgroundOn = await isFeatureEnabled("dev_tools_code_playground");
  const navCatalogTools = getDevToolsNavCatalogSorted(adminDoc, playgroundOn);

  return (
    <UmbrellaToolsLayout catalogTools={navCatalogTools}>
      <DevToolsAboutArticle />
    </UmbrellaToolsLayout>
  );
}
