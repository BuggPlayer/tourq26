"use client";

import { useState } from "react";
import Link from "next/link";

const baseNavLinks = [
  { href: "/hub", label: "Interview Hub", flag: "hub" as const },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/#why-us", label: "Why Us" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/blog", label: "Blog" },
  { href: "/tech-news", label: "Tech News" },
  { href: "/tools", label: "Tools", flag: "tools" as const },
  { href: "/freebies", label: "Freebies" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact", flag: "contact" as const },
];

export type HeaderNavFlags = {
  showInterviewHub?: boolean;
  showTools?: boolean;
  showContact?: boolean;
};

function buildNavLinks(flags?: HeaderNavFlags) {
  const showHub = flags?.showInterviewHub !== false;
  const showTools = flags?.showTools !== false;
  const showContact = flags?.showContact !== false;
  return baseNavLinks.filter((link) => {
    if ("flag" in link && link.flag === "hub" && !showHub) return false;
    if ("flag" in link && link.flag === "tools" && !showTools) return false;
    if ("flag" in link && link.flag === "contact" && !showContact) return false;
    return true;
  });
}

export default function Header({ navFlags }: { navFlags?: HeaderNavFlags }) {
  const [open, setOpen] = useState(false);
  const navLinks = buildNavLinks(navFlags);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl transition-opacity hover:opacity-90"
        >
          torq <span className="text-[var(--color-primary)]">studio</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--color-muted)] transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          {(navFlags?.showContact !== false) && (
            <Link
              href="/contact"
              className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--background)] transition-all hover:bg-[var(--color-primary-hover)] hover:shadow-lg hover:shadow-[var(--color-primary)]/20"
            >
              Get in touch
            </Link>
          )}
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className="flex flex-col gap-1.5 md:hidden rounded-lg p-2 -m-2 active:bg-white/5"
          onClick={() => setOpen(!open)}
        >
          <span
            className={`h-0.5 w-6 rounded-full bg-white transition-all duration-200 ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 rounded-full bg-white transition-all duration-200 ${open ? "opacity-0 scale-0" : ""}`}
          />
          <span
            className={`h-0.5 w-6 rounded-full bg-white transition-all duration-200 ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--color-border)]/50 bg-[var(--surface)]/95 backdrop-blur-xl md:hidden animate-fade-in">
          <nav className="flex flex-col gap-0.5 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {(navFlags?.showContact !== false) && (
              <Link
                href="/contact"
                className="mx-4 mt-2 block rounded-full bg-[var(--color-primary)] py-3.5 text-center font-semibold text-[var(--background)]"
                onClick={() => setOpen(false)}
              >
                Get in touch
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
