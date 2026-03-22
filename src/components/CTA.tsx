import Link from "next/link";
import Image from "next/image";

export default function CTA() {
  return (
    <section className="relative overflow-hidden border-t border-[var(--color-border)]/40 py-20 sm:py-24 lg:py-28">
      {/* Background visual */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(6, 182, 212, 0.15), transparent 55%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(167, 139, 250, 0.1), transparent 50%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.07]" aria-hidden>
        <Image src="/images/section-cta.svg" alt="" width={600} height={200} className="h-full w-full object-cover" unoptimized />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
          Need build, advice, or both?
        </h2>
        <p className="mt-4 text-[var(--color-muted)]">
          Free 30-min call—React Native, Node, MVP scope, or architecture review. Based in Mumbai; overlap with India, EU & MENA.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="btn-primary w-full rounded-full bg-[var(--color-primary)] px-8 py-4 text-base font-semibold text-[var(--background)] sm:w-auto"
          >
            Get free consultation
          </Link>
          <a
            href="mailto:hello@torqstudio.com"
            className="text-sm text-[var(--color-muted)] underline decoration-[var(--color-primary)]/50 underline-offset-4 transition-colors hover:text-[var(--color-primary)]"
          >
            hello@torqstudio.com
          </a>
        </div>
        <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
          No commitment · Clear path to results
        </p>
      </div>
    </section>
  );
}
