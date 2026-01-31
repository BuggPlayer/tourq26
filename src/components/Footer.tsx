import Link from "next/link";

const footerLinks = [
  { href: "#services", label: "Services" },
  { href: "#why-us", label: "Why Us" },
  { href: "#case-studies", label: "Case Studies" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)]/50 bg-[var(--surface)]">
      <div id="contact" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="font-display text-xl font-bold tracking-tight text-white"
            >
              torq <span className="text-[var(--color-primary)]">studio</span>
            </Link>
            <p className="mt-2 max-w-xs text-sm text-[var(--color-muted)]">
              Your trusted technology partner. Serving clients globally.
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
            <Link
              href="/privacy"
              className="text-sm text-[var(--color-muted)] transition-colors hover:text-white"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-[var(--color-muted)] transition-colors hover:text-white"
            >
              Terms
            </Link>
            <a
              href="mailto:hello@torqstudio.com"
              className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary)]"
            >
              Contact
            </a>
          </nav>
        </div>
        <p className="mt-6 text-center text-xs text-[var(--color-muted)]">
          Secure delivery · Your data is handled with care
        </p>
        <div className="mt-6 border-t border-[var(--color-border)]/50 pt-8 text-center text-sm text-[var(--color-muted)]">
          © {year} Torq Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
