import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import BcryptTool from "@/components/umbrella-tools/BcryptTool";
import { devToolsPageMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return devToolsPageMetadata("bcrypt-hash");
}

export default function BcryptHashPage() {
  return (
    <UmbrellaToolsLayout>
      <BcryptTool />
    </UmbrellaToolsLayout>
  );
}
