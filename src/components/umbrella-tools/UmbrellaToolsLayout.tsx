import Link from "next/link";
import MarketingHeader from "@/components/MarketingHeader";
import Footer from "@/components/Footer";

const nav = [
  { href: "/dev-tools", label: "Home" },
  { href: "/dev-tools/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
];

export default function UmbrellaToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingHeader />
      <div className="min-h-screen bg-[var(--background)] pt-28 sm:pt-32">
        <div className="border-b border-[var(--color-border)]/50 bg-[var(--color-surface)]/40">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="font-display text-lg font-semibold tracking-tight text-white transition-opacity hover:opacity-90"
            >
              torq <span className="text-[var(--color-primary)]">studio</span>
              <span className="ml-2 text-sm font-normal text-[var(--color-muted)]">· dev utilities</span>
            </Link>
            <nav className="flex flex-wrap items-center gap-4 text-sm">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[var(--color-muted)] transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">{children}</main>
      </div>
      <Footer />
    </>
  );
}
