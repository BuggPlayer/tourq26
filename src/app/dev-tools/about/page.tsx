import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import { DevToolsAboutArticle } from "@/components/umbrella-tools/DevToolsAboutArticle";
import { getDevToolsLocaleFromCookie } from "@/lib/dev-tools-locale-server";
import { getDevToolsSeoMessages } from "@/lib/dev-tools-seo-messages";
import { DEV_TOOLS_OG_IMAGE_PATH, umbrellaToolsMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getDevToolsLocaleFromCookie();
  const seo = getDevToolsSeoMessages(locale);
  return umbrellaToolsMetadata({
    title: seo.about.title,
    description: seo.about.description,
    path: "/dev-tools/about",
    ogImagePath: DEV_TOOLS_OG_IMAGE_PATH,
    titleSuffix: seo.titleSuffix,
  });
}

export default function DevToolsAboutPage() {
  return (
    <UmbrellaToolsLayout>
      <DevToolsAboutArticle />
    </UmbrellaToolsLayout>
  );
}
