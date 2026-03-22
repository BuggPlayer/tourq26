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
        <DialogPanel className="max-w-lg rounded-2xl border border-slate-600 bg-slate-900 p-6 text-slate-100 shadow-2xl">
          <DialogTitle className="font-display text-xl font-semibold">
            Build your product with TorqStudio
          </DialogTitle>
          <p className="mt-3 text-sm text-slate-300">
            You reached this from:{" "}
            <span className="font-medium text-cyan-400">{source}</span>. Our
            agency team ships production-grade web apps, design systems, and
            cloud backends — the same rigor we use in this interview hub.
          </p>
          <ul className="mt-4 list-inside list-disc text-sm text-slate-400">
            <li>Discovery & UX workshops</li>
            <li>Next.js / React product builds</li>
            <li>Ongoing support and hiring support</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/contact"
              className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              Talk to TorqStudio
            </a>
            <button
              type="button"
              onClick={close}
              className="rounded-lg border border-slate-500 px-4 py-2 text-sm hover:bg-slate-800"
            >
              Not now
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
