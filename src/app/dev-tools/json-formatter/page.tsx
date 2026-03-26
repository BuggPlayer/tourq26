import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import JsonFormatterTool from "@/components/umbrella-tools/JsonFormatterTool";
import { devToolsPageMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return devToolsPageMetadata("json-formatter");
}

export default function JsonFormatterPage() {
  return (
    <UmbrellaToolsLayout>
      <JsonFormatterTool />
    </UmbrellaToolsLayout>
  );
}
