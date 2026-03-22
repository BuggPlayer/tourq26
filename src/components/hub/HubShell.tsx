"use client";

import { HubMobileNav } from "@/components/hub/HubMobileNav";
import { HubSidebar } from "@/components/hub/HubSidebar";
import { HubTopBar } from "@/components/hub/HubTopBar";
import { useHubUi } from "@/stores/hub-ui-store";

export function HubShell({ children }: { children: React.ReactNode }) {
  const sidebarCollapsed = useHubUi((s) => s.sidebarCollapsed);

  return (
    <>
      <HubSidebar />
      <HubMobileNav />
      <div
        className={`transition-[padding] duration-200 ease-out ${
          sidebarCollapsed ? "lg:pl-0" : "lg:pl-72"
        }`}
      >
        <HubTopBar />
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">{children}</div>
      </div>
    </>
  );
}
