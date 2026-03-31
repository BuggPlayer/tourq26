import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import { DevToolsAboutArticle } from "@/components/umbrella-tools/DevToolsAboutArticle";
import { getDevToolsLocaleFromCookie } from "@/lib/dev-tools-locale-server";
import { devToolsAboutMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getDevToolsLocaleFromCookie();
  return devToolsAboutMetadata(locale);
}

export default function DevToolsAboutPage() {
  return (
    <UmbrellaToolsLayout>
      <DevToolsAboutArticle />
    </UmbrellaToolsLayout>
  );
}
