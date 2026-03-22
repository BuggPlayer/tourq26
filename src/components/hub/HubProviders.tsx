"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { useHubUi } from "@/stores/hub-ui-store";
import { AgencyModal } from "./AgencyModal";

function ThemeSync({ children }: { children: React.ReactNode }) {
  const theme = useHubUi((s) => s.theme);

  useEffect(() => {
    const el = document.getElementById("hub-root");
    if (!el) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark =
        theme === "dark" || (theme === "system" && mq.matches);
      el.dataset.hubTheme = dark ? "dark" : "light";
      el.style.setProperty("--hub-page-bg", dark ? "#020617" : "#f8fafc");
      el.style.setProperty("--hub-page-fg", dark ? "#f1f5f9" : "#0f172a");
      el.style.setProperty("--hub-muted", dark ? "#64748b" : "#475569");
      el.style.setProperty("--hub-border", dark ? "#1e293b" : "#e2e8f0");
      el.style.setProperty("--hub-elevated", dark ? "#0f172a" : "#ffffff");
      /* Accent: matches sidebar / top bar cyan; tuned per mode for contrast */
      el.style.setProperty("--hub-primary", dark ? "#0891b2" : "#0e7490");
      el.style.setProperty("--hub-primary-hover", dark ? "#06b6d4" : "#0891b2");
      el.style.setProperty("--hub-primary-foreground", "#ffffff");
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  return <>{children}</>;
}

export function HubProviders({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <ThemeSync>
        {children}
        <Toaster richColors position="top-center" closeButton />
        <AgencyModal />
      </ThemeSync>
    </SessionProvider>
  );
}
