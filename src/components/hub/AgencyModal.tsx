"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useHubUi } from "@/stores/hub-ui-store";

export function AgencyModal() {
  const open = useHubUi((s) => s.agencyOpen);
  const close = useHubUi((s) => s.closeAgency);
  const source = useHubUi((s) => s.lastAgencySource);

  return (
    <Dialog open={open} onClose={close} className="relative z-50">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="max-w-lg rounded-2xl border border-border bg-surface p-6 text-foreground shadow-2xl">
          <DialogTitle className="font-display text-xl font-semibold">
            Build your product with TorqStudio
          </DialogTitle>
          <p className="mt-3 text-sm text-foreground/90">
            You reached this from:{" "}
            <span className="font-medium text-primary">{source}</span>. Our
            agency team ships production-grade web apps, design systems, and
            cloud backends — the same rigor we use in this interview hub.
          </p>
          <ul className="mt-4 list-inside list-disc text-sm text-muted-foreground">
            <li>Discovery & UX workshops</li>
            <li>Next.js / React product builds</li>
            <li>Ongoing support and hiring support</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/contact"
              className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              Talk to TorqStudio
            </a>
            <button
              type="button"
              onClick={close}
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              Not now
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
