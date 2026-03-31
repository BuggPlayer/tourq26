import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import { DevToolsAboutArticle } from "@/components/umbrella-tools/DevToolsAboutArticle";
import { pathSegmentToLocale } from "@/lib/dev-tools-locale-path";
import { devToolsAboutMetadata } from "@/lib/umbrella-tools/seo";

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

  return (
    <UmbrellaToolsLayout>
      <DevToolsAboutArticle />
    </UmbrellaToolsLayout>
  );
}
