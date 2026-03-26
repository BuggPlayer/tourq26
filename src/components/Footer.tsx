import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/#why-us", label: "Why Us" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/blog", label: "Blog" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)]/40 bg-[var(--surface)]">
      <div id="contact" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="font-display text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-90"
            >
              torq <span className="text-[var(--color-primary)]">studio</span>
            </Link>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--color-muted)]">
              Senior software engineers for mobile apps, websites, APIs, and practical AI. We focus on clear scope,
              production-quality delivery, and direct communication—so you always know who is building and advising on
              your product.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 md:gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--color-muted)] transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/privacy" className="text-sm text-[var(--color-muted)] transition-colors hover:text-white">Privacy</Link>
            <Link href="/terms" className="text-sm text-[var(--color-muted)] transition-colors hover:text-white">Terms</Link>
            <Link href="/contact" className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]">Contact</Link>
          </nav>
        </div>
        <div className="mt-10 border-t border-[var(--color-border)]/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-[var(--color-muted)]">
            Secure delivery · Your data handled with care
          </p>
          <p className="text-sm text-[var(--color-muted)]">
            © {year} Torq Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
