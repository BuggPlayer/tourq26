import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden border-t border-[var(--color-border)]/50 py-20 sm:py-24 lg:py-28">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(6, 182, 212, 0.2), transparent 60%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(139, 92, 246, 0.15), transparent 50%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
          Ready for results?
        </h2>
        <p className="mt-4 text-lg text-[var(--color-muted)]">
          Get a free 30-min consultation. We’ll outline how we can reduce your
          costs and deliver on time.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="#contact"
            className="btn-primary w-full rounded-full bg-[var(--color-primary)] px-8 py-4 text-base font-semibold text-[var(--background)] sm:w-auto"
          >
            Get your free consultation
          </Link>
          <a
            href="mailto:hello@torqstudio.com"
            className="text-[var(--color-muted)] underline decoration-[var(--color-primary)] underline-offset-4 hover:text-[var(--color-primary)]"
          >
            hello@torqstudio.com
          </a>
        </div>
        <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
          No commitment · Discuss your goals and get a clear path to results
        </p>
      </div>
    </section>
  );
}
