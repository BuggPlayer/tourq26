import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import { DevToolsToolRouter } from "@/components/umbrella-tools/DevToolsToolRouter";
import { devToolsPageMetadata } from "@/lib/umbrella-tools/seo";
import { getDevToolBySlug, UMBRELLA_TOOLS } from "@/lib/umbrella-tools/tools-config";

export async function generateStaticParams() {
  return UMBRELLA_TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return devToolsPageMetadata(slug);
}

function ToolFallback() {
  return <p className="text-sm text-muted-foreground">Loading…</p>;
}

export default async function DevToolBySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getDevToolBySlug(slug)) notFound();
  return (
    <UmbrellaToolsLayout>
      <Suspense fallback={<ToolFallback />}>
        <DevToolsToolRouter slug={slug} />
      </Suspense>
    </UmbrellaToolsLayout>
  );
}
