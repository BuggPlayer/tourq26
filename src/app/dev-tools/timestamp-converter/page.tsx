import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import TimestampConverterTool from "@/components/umbrella-tools/TimestampConverterTool";
import { devToolsPageMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return devToolsPageMetadata("timestamp-converter");
}

export default function TimestampConverterPage() {
  return (
    <UmbrellaToolsLayout>
      <TimestampConverterTool />
    </UmbrellaToolsLayout>
  );
}
