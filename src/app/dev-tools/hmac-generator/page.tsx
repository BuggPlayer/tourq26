import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import HmacTool from "@/components/umbrella-tools/HmacTool";
import { devToolsPageMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return devToolsPageMetadata("hmac-generator");
}

export default function HmacGeneratorPage() {
  return (
    <UmbrellaToolsLayout>
      <HmacTool />
    </UmbrellaToolsLayout>
  );
}
