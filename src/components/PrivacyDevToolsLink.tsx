"use client";

import Link from "next/link";
import { useExternalDevToolsHubHref } from "@/hooks/useExternalDevToolsHubHref";

/** Link to the standalone Torq DevTools hub when `NEXT_PUBLIC_DEV_TOOLS_URL` is configured. */
export function PrivacyDevToolsLink({ className }: { className?: string }) {
  const href = useExternalDevToolsHubHref();
  if (!href) {
    return <span className={className}>Torq DevTools</span>;
  }
  return (
    <Link href={href} className={className}>
      Torq DevTools
    </Link>
  );
}
