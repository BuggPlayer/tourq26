import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import Base64Tool from "@/components/umbrella-tools/Base64Tool";
import { devToolsPageMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return devToolsPageMetadata("base64");
}

export default function Base64Page() {
  return (
    <UmbrellaToolsLayout>
      <Base64Tool />
    </UmbrellaToolsLayout>
  );
}
