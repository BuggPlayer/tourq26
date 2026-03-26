import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import Base32Tool from "@/components/umbrella-tools/Base32Tool";
import { devToolsPageMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return devToolsPageMetadata("base32-encode-decode");
}

export default function Base32EncodeDecodePage() {
  return (
    <UmbrellaToolsLayout>
      <Base32Tool />
    </UmbrellaToolsLayout>
  );
}
