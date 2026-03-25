import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import SvgToCssBackgroundTool from "@/components/umbrella-tools/SvgToCssBackgroundTool";
import { umbrellaToolsMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return umbrellaToolsMetadata({
    title: "SVG to CSS background",
    description: "Convert SVG markup to a data URL and CSS background-image snippet. Paste or upload .svg files.",
    path: "/dev-tools/svg-to-css-background",
  });
}

export default function SvgToCssBackgroundPage() {
  return (
    <UmbrellaToolsLayout>
      <SvgToCssBackgroundTool />
    </UmbrellaToolsLayout>
  );
}
