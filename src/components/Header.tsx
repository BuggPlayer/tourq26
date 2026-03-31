"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useDevToolsHubHref } from "@/hooks/useDevToolsHubHref";

const baseNavLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/#why-us", label: "Why Us" },
  { href: "/blog", label: "Blog" },
  { href: "/dev-tools", label: "Dev tools", flag: "tools" as const },
  { href: "/#testimonials", label: "Testimonials" },
];

export type HeaderNavFlags = {
  showTools?: boolean;
};

function buildNavLinks(flags?: HeaderNavFlags) {
  const showTools = flags?.showTools !== false;
  return baseNavLinks.filter((link) => {
    if ("flag" in link && link.flag === "tools" && !showTools) return false;
    return true;
  });
}

export default function Header({
  navFlags,
  endSlot,
}: {
  navFlags?: HeaderNavFlags;
  /** Theme + font controls (client components) */
  endSlot?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const devToolsHubHref = useDevToolsHubHref();
  const navLinks = buildNavLinks(navFlags);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl transition-opacity hover:opacity-90"
        >
          torq <span className="text-primary">studio</span>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-3 md:gap-4">
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => {
              const href = link.href === "/dev-tools" ? devToolsHubHref : link.href;
              return (
                <Link
                  key={link.href === "/dev-tools" ? "dev-tools" : link.href}
                  href={href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          {endSlot ? <div className="hidden shrink-0 items-center md:flex">{endSlot}</div> : null}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="flex flex-col gap-1.5 md:hidden rounded-lg p-2 -m-2 active:bg-muted/50"
          onClick={() => setOpen(!open)}
        >
          <span
            className={`h-0.5 w-6 rounded-full bg-foreground transition-all duration-200 ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 rounded-full bg-foreground transition-all duration-200 ${open ? "opacity-0 scale-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 rounded-full bg-foreground transition-all duration-200 ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div className="border-t border-border/50 bg-surface/95 backdrop-blur-xl md:hidden animate-fade-in">
          <div className="flex flex-col gap-3 px-4 py-4">
            {endSlot ? <div className="flex justify-end border-b border-border/40 pb-3">{endSlot}</div> : null}
            <nav className="flex flex-col gap-0.5">
              {navLinks.map((link) => {
                const href = link.href === "/dev-tools" ? devToolsHubHref : link.href;
                return (
                  <Link
                    key={link.href === "/dev-tools" ? "dev-tools" : link.href}
                    href={href}
                    className="rounded-xl px-4 py-3.5 text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
