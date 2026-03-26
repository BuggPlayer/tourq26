import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import SvgToCssBackgroundTool from "@/components/umbrella-tools/SvgToCssBackgroundTool";
import { devToolsPageMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return devToolsPageMetadata("svg-to-css-background");
}

export default function SvgToCssBackgroundPage() {
  return (
    <UmbrellaToolsLayout>
      <SvgToCssBackgroundTool />
    </UmbrellaToolsLayout>
  );
}
