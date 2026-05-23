import Link from "next/link";

/**
 * Hero band (DESIGN.md → hero-band-dark).
 * 50/50 split: sentence-case display headline + CTA cluster on the left,
 * brand gradient ribbon on the right. The ribbon is the brand's single piece
 * of decorative chrome — built with layered translucent stripes, no SVG asset.
 */

const solutions = [
  "Mobile apps",
  "Web platforms",
  "APIs",
  "AI workflows",
  "Consulting",
];

export default function Hero() {
  return (
    <section className="hero-band relative">
      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-12 px-4 pt-32 pb-24 sm:px-6 sm:pt-36 sm:pb-28 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pt-40 lg:pb-32">
        <div className="lg:col-span-7">
          <p className="mono-eyebrow animate-fade-up text-white/65 opacity-0 animate-delay-1">
            ENGINEERING-LED · MOBILE · WEB · AI
          </p>
          <h1 className="display-xxl animate-fade-up mt-5 max-w-[16ch] text-white opacity-0 animate-delay-2">
            Build what&apos;s next with senior engineers, not slide decks.
          </h1>
          <p className="animate-fade-up mt-6 max-w-xl text-[17px] leading-[1.5] tracking-[-0.01em] text-white/70 opacity-0 animate-delay-3">
            Torq Studio ships mobile apps, web platforms, public APIs, and
            grounded AI workflows. You work directly with the engineers doing
            the work — no account layers, no black-box estimates.
          </p>

          <div className="animate-fade-up mt-8 flex flex-wrap items-center gap-3 opacity-0 animate-delay-4">
            <Link href="/contact" className="btn-base btn-white">
              Get started
            </Link>
            <Link href="/contact" className="btn-base btn-mint">
              Book free consultation
            </Link>
            <Link href="/#case-studies" className="btn-base btn-ghost-on-dark">
              See results
            </Link>
          </div>

          <ul className="animate-fade-up mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 opacity-0 animate-delay-5">
            {solutions.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[13px] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-mint)]" aria-hidden />
                <span className="font-medium tracking-tight">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <div className="animate-scale-in opacity-0 animate-delay-2">
            <div className="brand-ribbon animate-ribbon">
              <div className="ribbon-inner" aria-hidden />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-6 text-[12px] text-white/50">
              <span className="mono-eyebrow">SHIP · OPERATE · ADVISE</span>
              <span className="hidden sm:inline">India · MENA · EU overlap</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
