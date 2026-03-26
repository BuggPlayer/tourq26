import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import JwtDecoderTool from "@/components/umbrella-tools/JwtDecoderTool";
import { devToolsPageMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return devToolsPageMetadata("jwt-decoder");
}

export default function JwtDecoderPage() {
  return (
    <UmbrellaToolsLayout>
      <JwtDecoderTool />
    </UmbrellaToolsLayout>
  );
}
