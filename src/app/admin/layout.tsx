import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await isAdmin();
  return (
    <div className="min-h-screen bg-background text-foreground">
      {ok ? (
        <>
          <header className="sticky top-0 z-10 border-b border-border/50 bg-background/95 backdrop-blur">
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
          <div className="mx-auto flex max-w-6xl gap-8 px-4 py-6">
            <aside className="w-48 shrink-0 space-y-1">
              <NavLink href="/admin/dashboard">Dashboard</NavLink>
              <NavLink href="/admin/contact">Contact</NavLink>
              <NavLink href="/admin/blog">Blog</NavLink>
              <NavLink href="/admin/testimonials">Testimonials</NavLink>
              <NavLink href="/admin/site">Site & SEO</NavLink>
              <NavLink href="/admin/feature-flags">Feature flags</NavLink>
            </aside>
            <main className="min-w-0 flex-1">{children}</main>
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
