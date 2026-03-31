"use client";

import Link from "next/link";
import { useDevToolsHubHref } from "@/hooks/useDevToolsHubHref";

/** Resolves /dev-tools vs /{locale}/dev-tools from the same cookie preference as the dev-tools area. */
export function PrivacyDevToolsLink({ className }: { className?: string }) {
  const href = useDevToolsHubHref();
  return (
    <Link href={href} className={className}>
      /dev-tools
    </Link>
  );
}
