import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import ChecksumCalculatorTool from "@/components/umbrella-tools/ChecksumCalculatorTool";
import { devToolsPageMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return devToolsPageMetadata("checksum-calculator");
}

export default function ChecksumCalculatorPage() {
  return (
    <UmbrellaToolsLayout>
      <ChecksumCalculatorTool />
    </UmbrellaToolsLayout>
  );
}
