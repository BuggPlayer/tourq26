import Link from "next/link";

/**
 * Footer (DESIGN.md → footer + footer-wordmark-banner).
 * 4-column nav on canvas-white, mono uppercase eyebrows for each column.
 * Below the nav, a faint "torq.studio" wordmark stretches edge-to-edge as
 * the brand's terminal sign-off (rendered in the display sans at hairline
 * tint).
 */

const navColumns: { eyebrow: string; links: { href: string; label: string }[] }[] = [
  {
    eyebrow: "PLATFORM",
    links: [
      { href: "/services/mobile-app-development", label: "Mobile applications" },
      { href: "/services/web-development", label: "Web & APIs" },
      { href: "/services/ai-solutions", label: "AI workflows" },
      { href: "/services/remote-it", label: "Remote engineering" },
      { href: "/services/technical-consulting", label: "Advisory" },
    ],
  },
  {
    eyebrow: "EVIDENCE",
    links: [
      { href: "/case-studies", label: "Case studies" },
      { href: "/blog", label: "Blog & guides" },
      { href: "/freebies", label: "Free templates" },
      { href: "/tech-news", label: "Tech news" },
      { href: "/#testimonials", label: "Client voices" },
    ],
  },
  {
    eyebrow: "COMPANY",
    links: [
      { href: "/about", label: "About Torq Studio" },
      { href: "/#why-us", label: "Why us" },
      { href: "/contact", label: "Contact sales" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
  {
    eyebrow: "GET STARTED",
    links: [
      { href: "/contact", label: "Book a consultation" },
      { href: "mailto:hello@torqstudio.com", label: "hello@torqstudio.com" },
      { href: "/services", label: "Service catalogue" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="band-light border-t border-hairline"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      {/* Brand summary + columns */}
      <div className="mx-auto w-full max-w-[1280px] px-4 pt-16 pb-12 sm:px-6 sm:pt-20 lg:px-8 lg:pt-[80px]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="font-display text-[24px] font-medium tracking-[-0.02em] text-foreground transition-opacity hover:opacity-80"
            >
              torq<span className="brand-gradient-text">.studio</span>
            </Link>
            <p className="mt-4 max-w-sm text-[15px] leading-[1.5] text-muted-foreground">
              Senior software engineers for mobile applications, web platforms, public
              APIs, and grounded AI workflows. Clear scope, direct communication,
              production-quality delivery — every engagement.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/contact" className="btn-base btn-primary">
                Contact sales
              </Link>
              <Link href="/contact" className="btn-base btn-outline">
                Book a call
              </Link>
            </div>
          </div>

          <nav className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            {navColumns.map((col) => (
              <div key={col.eyebrow}>
                <p className="mono-eyebrow text-muted-foreground">{col.eyebrow}</p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={`${col.eyebrow}-${link.href}`}>
                      <Link
                        href={link.href}
                        className="text-[15px] leading-snug text-foreground/85 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono-label text-muted-foreground">
            © {year} TORQ STUDIO · ALL RIGHTS RESERVED
          </p>
          <p className="mono-label text-muted-foreground">
            BASED IN MUMBAI · OVERLAP WITH INDIA / EU / MENA
          </p>
        </div>
      </div>

      {/* Wordmark banner — terminal sign-off */}
      <div aria-hidden className="overflow-hidden">
        <span className="wordmark-banner">torq.studio</span>
      </div>
    </footer>
  );
}
