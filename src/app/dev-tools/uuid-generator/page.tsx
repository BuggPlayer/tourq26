import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import UuidGeneratorTool from "@/components/umbrella-tools/UuidGeneratorTool";
import { devToolsPageMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return devToolsPageMetadata("uuid-generator");
}

export default function UuidGeneratorPage() {
  return (
    <UmbrellaToolsLayout>
      <UuidGeneratorTool />
    </UmbrellaToolsLayout>
  );
}
