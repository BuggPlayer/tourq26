import type { Metadata } from "next";
import UmbrellaToolsLayout from "@/components/umbrella-tools/UmbrellaToolsLayout";
import QrCodeTool from "@/components/umbrella-tools/QrCodeTool";
import { devToolsPageMetadata } from "@/lib/umbrella-tools/seo";

export async function generateMetadata(): Promise<Metadata> {
  return devToolsPageMetadata("qr-code-generator");
}

export default function QrCodeGeneratorPage() {
  return (
    <UmbrellaToolsLayout>
      <QrCodeTool />
    </UmbrellaToolsLayout>
  );
}
