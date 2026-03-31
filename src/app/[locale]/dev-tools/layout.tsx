import { notFound } from "next/navigation";
import { DevToolsLocaleProvider } from "@/components/umbrella-tools/DevToolsLocaleProvider";
import { pathSegmentToLocale } from "@/lib/dev-tools-locale-path";

export default async function DevToolsPrefixedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: segment } = await params;
  const locale = pathSegmentToLocale(segment);
  if (!locale) notFound();

  return <DevToolsLocaleProvider initialLocale={locale}>{children}</DevToolsLocaleProvider>;
}
