import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import DatabaseUrlParserTool from "@/components/umbrella-tools/DatabaseUrlParserTool";
import { devToolsPageMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return devToolsPageMetadata("database-url-parser");
}

export default function DatabaseUrlParserPage() {
  return (
    <UmbrellaToolsLayout>
      <DatabaseUrlParserTool />
    </UmbrellaToolsLayout>
  );
}
