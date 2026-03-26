import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import HashGeneratorTool from "@/components/umbrella-tools/HashGeneratorTool";
import { devToolsPageMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return devToolsPageMetadata("hash-generator");
}

export default function HashGeneratorPage() {
  return (
    <UmbrellaToolsLayout>
      <HashGeneratorTool />
    </UmbrellaToolsLayout>
  );
}
