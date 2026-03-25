import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import CssShadowGeneratorTool from "@/components/umbrella-tools/CssShadowGeneratorTool";
import { umbrellaToolsMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return umbrellaToolsMetadata({
    title: "CSS box-shadow generator",
    description: "Interactive box-shadow controls with live preview and copy-ready CSS.",
    path: "/dev-tools/css-shadow-generator",
  });
}

export default function CssShadowGeneratorPage() {
  return (
    <UmbrellaToolsLayout>
      <CssShadowGeneratorTool />
    </UmbrellaToolsLayout>
  );
}
