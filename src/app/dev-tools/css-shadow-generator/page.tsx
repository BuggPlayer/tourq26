import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import CssShadowGeneratorTool from "@/components/umbrella-tools/CssShadowGeneratorTool";
import { devToolsPageMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return devToolsPageMetadata("css-shadow-generator");
}

export default function CssShadowGeneratorPage() {
  return (
    <UmbrellaToolsLayout>
      <CssShadowGeneratorTool />
    </UmbrellaToolsLayout>
  );
}
