import type { Metadata } from "next";
import { Suspense } from "react";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import PastebinTool from "@/components/umbrella-tools/PastebinTool";
import { devToolsPageMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return devToolsPageMetadata("pastebin");
}

function PastebinFallback() {
  return (
    <p className="text-sm text-muted-foreground" role="status">
      Loading paste pad…
    </p>
  );
}

export default function PastebinPage() {
  return (
    <UmbrellaToolsLayout>
      <Suspense fallback={<PastebinFallback />}>
        <PastebinTool />
      </Suspense>
    </UmbrellaToolsLayout>
  );
}
