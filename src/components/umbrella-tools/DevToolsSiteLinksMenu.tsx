"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Link from "next/link";
import { useCallback } from "react";

export type DevToolsSiteLinkItem = { href: string; label: string };

type Props = {
  open: boolean;
  onClose: () => void;
  links: DevToolsSiteLinkItem[];
  /** e.g. “Site pages” */
  menuHeading: string;
  /** Close control label */
  closeLabel: string;
};

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-foreground" aria-hidden>
      <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Mobile-only trigger for the site links sheet. */
export function DevToolsSiteLinksMenuTrigger({
  open,
  onToggle,
  openLabel,
  closeLabel,
}: {
  open: boolean;
  onToggle: () => void;
  openLabel: string;
  closeLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="dev-tools-site-menu"
      aria-label={open ? closeLabel : openLabel}
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background text-foreground shadow-sm transition-colors hover:bg-surface-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:hidden"
    >
      <HamburgerIcon />
    </button>
  );
}

export function DevToolsSiteLinksMenu({ open, onClose, links, menuHeading, closeLabel }: Props) {
  const close = useCallback(() => onClose(), [onClose]);

  return (
    <Dialog open={open} onClose={close} className="relative z-[60] sm:hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity dark:bg-black/70" aria-hidden />

      <div className="fixed inset-0 flex flex-col justify-end">
        <DialogPanel
          id="dev-tools-site-menu"
          transition
          className="max-h-[min(85dvh,28rem)] w-full overflow-hidden rounded-t-3xl border border-border/60 border-b-0 bg-background pb-1 shadow-[0_-12px_48px_-12px_rgba(0,0,0,0.35)] transition duration-200 ease-out data-[closed]:translate-y-8 data-[closed]:opacity-0"
        >
          <div className="border-b border-border/40 px-4 pb-4 pt-3 ps-[max(1rem,env(safe-area-inset-left,0px))] pe-[max(1rem,env(safe-area-inset-right,0px))]">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted-foreground/25" aria-hidden />
            <div className="flex items-start justify-between gap-3">
              <DialogTitle className="font-display text-lg font-semibold tracking-tight text-foreground">
                {menuHeading}
              </DialogTitle>
              <button
                type="button"
                onClick={close}
                aria-label={closeLabel}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-transparent text-muted-foreground transition-colors hover:border-border/60 hover:bg-surface-elevated hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <nav
            className="mt-2 max-h-[min(60dvh,22rem)] overflow-y-auto overscroll-y-contain px-2 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] ps-[max(0.5rem,env(safe-area-inset-left,0px))] pe-[max(0.5rem,env(safe-area-inset-right,0px))] pt-1 [-webkit-overflow-scrolling:touch]"
            aria-label={menuHeading}
          >
            <ul className="flex flex-col gap-1">
              {links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-surface-elevated active:bg-surface-elevated"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
