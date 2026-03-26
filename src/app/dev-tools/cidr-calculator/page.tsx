import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import CidrCalculatorTool from "@/components/umbrella-tools/CidrCalculatorTool";
import { devToolsPageMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return devToolsPageMetadata("cidr-calculator");
}

export default function CidrCalculatorPage() {
  return (
    <UmbrellaToolsLayout>
      <CidrCalculatorTool />
    </UmbrellaToolsLayout>
  );
}
