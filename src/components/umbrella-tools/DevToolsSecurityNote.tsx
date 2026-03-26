import type { ReactNode } from "react";
import Link from "next/link";

type Props = {
  /** Replaces the default first sentence (before the “how we handle data” link). */
  lead?: ReactNode;
};

export function DevToolsSecurityNote({ lead }: Props) {
  return (
    <aside
      className="mb-8 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm leading-relaxed text-foreground/90"
      role="note"
    >
      <p className="font-medium text-foreground">Privacy</p>
      <p className="mt-1 text-muted-foreground">
        {lead ?? (
          <>
            Nothing here is sent to Torq Studio servers — processing stays in this browser tab.{" "}
          </>
        )}
        <Link href="/dev-tools/about" className="font-medium text-primary underline-offset-2 hover:underline">
          How we handle data
        </Link>
        .
      </p>
    </aside>
  );
}
