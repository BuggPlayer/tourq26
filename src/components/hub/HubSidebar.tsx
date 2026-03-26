"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHubUi } from "@/stores/hub-ui-store";

const nav = [
  { href: "/hub", label: "Overview" },
  { href: "/hub/candidate", label: "Candidate hub" },
  { href: "/hub/hiring", label: "Hiring mode" },
  { href: "/hub/jobs", label: "Job board" },
  { href: "/hub/talent", label: "Talent pool" },
  { href: "/hub/mock-interview", label: "Mock interviews" },
  { href: "/hub/community", label: "Community" },
  { href: "/hub/pricing", label: "Pricing" },
];

function navItemActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href === "/hub/candidate") {
    return pathname.startsWith("/hub/candidate");
  }
  if (href === "/hub") return false;
  return pathname.startsWith(`${href}/`);
}

export function HubSidebar() {
  const pathname = usePathname();
  const openAgency = useHubUi((s) => s.openAgency);
  const sidebarCollapsed = useHubUi((s) => s.sidebarCollapsed);

  if (sidebarCollapsed) {
    return null;
  }

  return (
    <aside
      className="fixed bottom-0 left-0 top-0 z-40 hidden w-72 flex-col border-r p-4 backdrop-blur-md lg:flex"
      style={{
        borderColor: "var(--hub-border, #1e293b)",
        backgroundColor: "color-mix(in srgb, var(--hub-elevated, #0f172a) 92%, transparent)",
      }}
      aria-label="Interview hub navigation"
    >
      <Link
        href="/hub"
        className="font-display text-lg font-bold tracking-tight text-primary"
      >
        TorqStudio Interview Hub
      </Link>
      <p className="mt-1 text-xs" style={{ color: "var(--hub-muted, #64748b)" }}>
        Practice. Perform. Get hired.
      </p>
      <nav className="mt-8 flex flex-1 flex-col gap-1" role="navigation">
        {nav.map((item) => {
          const active = navItemActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                active
                  ? "bg-cyan-500/15 text-primary"
                  : "opacity-90 hover:bg-black/10"
              }`}
              style={
                !active ? { color: "var(--hub-page-fg, #e2e8f0)" } : undefined
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div
        className="mt-4 rounded-xl border p-3 text-xs"
        style={{
          borderColor: "var(--hub-border, #334155)",
          backgroundColor: "color-mix(in srgb, var(--hub-elevated) 85%, transparent)",
        }}
      >
        <p className="font-medium" style={{ color: "var(--hub-page-fg)" }}>
          Need help building your product?
        </p>
        <button
          type="button"
          onClick={() => openAgency("sidebar")}
          className="mt-2 w-full rounded-lg bg-violet-600 px-3 py-2 text-center text-xs font-semibold text-foreground hover:bg-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
        >
          Talk to TorqStudio
        </button>
      </div>
      <Link
        href="/"
        className="mt-3 text-center text-xs underline-offset-2 hover:text-primary hover:underline"
        style={{ color: "var(--hub-muted)" }}
      >
        ← Main TorqStudio site
      </Link>
    </aside>
  );
}
