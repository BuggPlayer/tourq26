import Link from "next/link";

/**
 * Marketing CTA band (DESIGN.md → hero-band-dark + button-primary).
 * Closing dark band before the footer: sentence-case display-xl headline,
 * primary black/white pill, and a single mint pill for the secondary CTA.
 */

export default function CTA() {
  return (
    <section className="hero-band border-t border-[var(--brand-hairline-on-dark)]">
      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-[80px]">
        <div className="lg:col-span-7">
          <p className="mono-eyebrow text-white/55">START THE CONVERSATION</p>
          <h2 className="display-xl mt-4 max-w-[20ch] text-white">
            Start building on Torq Studio.
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-[1.5] text-white/65">
            Free 30-minute call — bring a problem, a stack, or a one-pager.
            We&apos;ll respond with a sensible next step: a fixed scope, a
            paid discovery, or a polite redirect if we&apos;re not the fit.
          </p>
        </div>
        <div className="flex flex-col items-start gap-4 lg:col-span-5 lg:items-end lg:justify-center">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/contact" className="btn-base btn-white">
              Contact sales
            </Link>
            <Link href="/contact" className="btn-base btn-mint">
              Get started now
            </Link>
          </div>
          <a
            href="mailto:hello@torqstudio.com"
            className="mono-label text-white/55 underline-offset-4 hover:text-white hover:underline"
          >
            HELLO@TORQSTUDIO.COM
          </a>
          <p className="mono-label text-white/40">
            NO COMMITMENT · 24 HOUR REPLY
          </p>
        </div>
      </div>
    </section>
  );
}
