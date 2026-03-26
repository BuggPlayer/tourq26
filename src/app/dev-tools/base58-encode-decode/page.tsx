import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import Base58Tool from "@/components/umbrella-tools/Base58Tool";
import { devToolsPageMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return devToolsPageMetadata("base58-encode-decode");
}

export default function Base58EncodeDecodePage() {
  return (
    <UmbrellaToolsLayout>
      <Base58Tool />
    </UmbrellaToolsLayout>
  );
}
