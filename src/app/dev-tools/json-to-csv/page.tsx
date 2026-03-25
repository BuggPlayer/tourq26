import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import JsonToCsvTool from "@/components/umbrella-tools/JsonToCsvTool";
import { umbrellaToolsMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return umbrellaToolsMetadata({
    title: "JSON to CSV",
    description: "Turn a JSON array of objects into CSV. Download or copy from the browser.",
    path: "/dev-tools/json-to-csv",
  });
}

export default function JsonToCsvPage() {
  return (
    <UmbrellaToolsLayout>
      <JsonToCsvTool />
    </UmbrellaToolsLayout>
  );
}
