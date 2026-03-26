import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";
import "quill/dist/quill.snow.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await isAdmin();
  return (
    <div className={ok ? "flex h-[100dvh] flex-col overflow-hidden bg-background text-foreground" : "min-h-screen bg-background text-foreground"}>
      {ok ? (
        <>
          <header className="shrink-0 border-b border-border/50 bg-background/95 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
              <Link href="/admin/dashboard" className="font-semibold text-foreground">
                Torq Admin
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/" target="_blank" className="text-sm text-muted-foreground hover:text-foreground">
                  View site
                </Link>
                <LogoutButton />
              </div>
            </div>
          </header>
          <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 gap-8 overflow-hidden px-4 py-6">
            <aside className="w-48 shrink-0 space-y-1 overflow-y-auto pr-1">
              <NavLink href="/admin/dashboard">Dashboard</NavLink>
              <NavLink href="/admin/contact">Contact</NavLink>
              <NavLink href="/admin/blog">Blog</NavLink>
              <NavLink href="/admin/testimonials">Testimonials</NavLink>
              <NavLink href="/admin/site">Site & SEO</NavLink>
              <NavLink href="/admin/feature-flags">Feature flags</NavLink>
              <NavLink href="/admin/dev-tools">Dev tools</NavLink>
            </aside>
            <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">{children}</main>
          </div>
        </>
      ) : (
        <>{children}</>
      )}
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      {children}
    </Link>
  );
}
