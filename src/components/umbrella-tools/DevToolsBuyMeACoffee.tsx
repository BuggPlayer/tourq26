"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDevToolsCanonicalSuffix } from "@/lib/dev-tools-locale-path";

const BMC_URL = process.env.NEXT_PUBLIC_BUYMEACOFFEE_URL?.trim();

function CoffeeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
      <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M6 2v2" />
      <path d="M10 2v2" />
      <path d="M14 2v2" />
    </svg>
  );
}

/**
 * Shown only on `/dev-tools/[slug]` (not hub, not about) when `NEXT_PUBLIC_BUYMEACOFFEE_URL` is set.
 */
export function DevToolsBuyMeACoffee() {
  const pathname = usePathname();
  if (!BMC_URL) return null;

  const suffix = getDevToolsCanonicalSuffix(pathname);
  const segs = suffix.replace(/^\//, "").split("/").filter(Boolean);
  const isToolDetail =
    segs.length === 2 && segs[0] === "dev-tools" && segs[1] !== "about";
  if (!isToolDetail) return null;

  return (
    <div className="mt-8 flex justify-center sm:justify-end">
      <Link
        href={BMC_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-[#FFD54F]/35 bg-[#FFDD00]/10 px-3 py-2 text-xs font-semibold text-foreground shadow-sm ring-1 ring-inset ring-white/[0.06] transition-all hover:bg-[#FFDD00]/18 hover:shadow-md dark:border-[#FFD54F]/25 dark:text-[#fffbeb]"
      >
        <CoffeeIcon className="h-4 w-4 shrink-0 text-[#0c0a09] dark:text-[#FFD54F]" />
        <span className="text-[#0c0a09] dark:text-[#fffbeb]">Buy me a coffee</span>
      </Link>
    </div>
  );
}
