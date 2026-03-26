import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import RandomStringTool from "@/components/umbrella-tools/RandomStringTool";
import { devToolsPageMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return devToolsPageMetadata("random-string");
}

export default function RandomStringPage() {
  return (
    <UmbrellaToolsLayout>
      <RandomStringTool />
    </UmbrellaToolsLayout>
  );
}
