import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import UrlEncodeTool from "@/components/umbrella-tools/UrlEncodeTool";
import { devToolsPageMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return devToolsPageMetadata("url-encode");
}

export default function UrlEncodePage() {
  return (
    <UmbrellaToolsLayout>
      <UrlEncodeTool />
    </UmbrellaToolsLayout>
  );
}
