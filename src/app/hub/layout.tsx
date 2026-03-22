import type { Metadata } from "next";
import { auth } from "@/lib/hub/auth";
import { HubProviders } from "@/components/hub/HubProviders";
import { HubShell } from "@/components/hub/HubShell";

export const metadata: Metadata = {
  title: "Interview Hub | TorqStudio",
  description:
    "TorqStudio Interview Hub — DSA, UI challenges, system design, mock interviews, and hiring tools.",
};

export default async function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <HubProviders session={session}>
      <div
        id="hub-root"
        className="min-h-screen transition-colors"
        style={{
          backgroundColor: "var(--hub-page-bg, #020617)",
          color: "var(--hub-page-fg, #f1f5f9)",
        }}
      >
        <HubShell>{children}</HubShell>
      </div>
    </HubProviders>
  );
}
