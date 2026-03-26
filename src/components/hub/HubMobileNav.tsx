"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const links = [
  { href: "/hub", label: "Overview" },
  { href: "/hub/candidate", label: "Candidate" },
  { href: "/hub/hiring", label: "Hiring" },
  { href: "/hub/jobs", label: "Jobs" },
  { href: "/hub/pricing", label: "Pricing" },
];

function menuLinkActive(pathname: string, href: string): boolean {
  if (href === "/hub/candidate") {
    return pathname.startsWith("/hub/candidate");
  }
  return pathname === href;
}

export function HubMobileNav() {
  const pathname = usePathname();

  return (
    <div
      className="flex items-center justify-between border-b px-3 py-2 lg:hidden"
      style={{
        borderColor: "var(--hub-border, #1e293b)",
        backgroundColor:
          "color-mix(in srgb, var(--hub-page-bg, #020617) 92%, transparent)",
      }}
    >
      <Link
        href="/hub"
        className="font-display text-sm font-bold text-primary"
      >
        {pathname === "/hub" ? "TorqStudio Hub" : "Interview Hub"}
      </Link>
      <Menu as="div" className="relative">
        <MenuButton
          type="button"
          className="rounded-lg border px-3 py-1.5 text-sm"
          style={{
            borderColor: "var(--hub-border, #334155)",
            color: "var(--hub-page-fg, #f1f5f9)",
            backgroundColor: "color-mix(in srgb, var(--hub-elevated) 70%, transparent)",
          }}
          aria-label="Open menu"
        >
          Menu
        </MenuButton>
        <MenuItems
          transition
          className="absolute right-0 z-50 mt-1 w-52 origin-top-right rounded-lg border py-1 shadow-xl"
          style={{
            borderColor: "var(--hub-border, #334155)",
            backgroundColor: "var(--hub-elevated, #0f172a)",
          }}
        >
          {links.map((l) => (
            <MenuItem key={l.href}>
              {({ focus }) => (
                <Link
                  href={l.href}
                  className={`block px-3 py-2 text-sm ${
                    menuLinkActive(pathname, l.href)
                      ? "font-semibold text-primary"
                      : ""
                  }`}
                  style={{
                    ...(!menuLinkActive(pathname, l.href)
                      ? { color: "var(--hub-page-fg, #e2e8f0)" }
                      : {}),
                    backgroundColor: focus
                      ? "color-mix(in srgb, var(--hub-page-fg) 8%, transparent)"
                      : undefined,
                  }}
                >
                  {l.label}
                </Link>
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
    </div>
  );
}
