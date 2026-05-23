import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

export function AdminTopBar() {
  return (
    <header className="shrink-0 border-b border-border/60 bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center justify-between gap-4 px-5 lg:px-6">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 font-display text-[15px] font-medium tracking-tight text-foreground"
        >
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: "var(--brand-gradient)" }}
            aria-hidden
          />
          Torq Admin
        </Link>
        <div className="flex items-center gap-5 text-[13px]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            View site
            <span aria-hidden>↗</span>
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
