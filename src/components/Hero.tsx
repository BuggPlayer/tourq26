import Link from "next/link";
import Image from "next/image";

const solutions = ["Mobile apps", "Web & APIs", "AI & automation", "Integrations", "Custom software"];

export default function Hero() {
  return (
    <section className="hero-section relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-4 pt-28 pb-24 sm:px-6 lg:px-8">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-80 w-80 rounded-full bg-[var(--color-primary)]/15 blur-[120px]" aria-hidden />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-[var(--color-accent)]/12 blur-[100px]" aria-hidden />

      {/* Hero visual — larger, more prominent */}
      <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block lg:opacity-90 xl:opacity-100">
        <Image
          src="/images/hero-illustration.svg"
          alt=""
          width={480}
          height={320}
          className="h-56 w-auto xl:h-72 animate-float"
          unoptimized
          priority
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/35 bg-[var(--color-primary-muted)] px-4 py-2 text-sm font-medium text-[var(--color-primary)] opacity-0 animate-delay-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary)] opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-primary)]" />
          </span>
          Free 30-min consultation
        </div>

        <h1 className="animate-fade-up mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-white opacity-0 sm:text-5xl md:text-6xl lg:text-7xl animate-delay-2">
          Build what’s next.{" "}
          <span className="bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary-hover)] to-[var(--color-accent)] bg-clip-text text-transparent">
            Ship on time.
          </span>
        </h1>
        <p className="animate-fade-up mx-auto mt-5 max-w-xl text-base text-[var(--color-muted)] opacity-0 sm:text-lg animate-delay-3">
          Mobile apps, web platforms, AI—we deliver. Save up to{" "}
          <span className="font-semibold text-white">40%</span> on development with a free consultation.
        </p>

        <div className="animate-fade-up mt-6 flex flex-wrap items-center justify-center gap-2 opacity-0 sm:gap-3 animate-delay-3">
          {solutions.map((item) => (
            <span
              key={item}
              className="rounded-full bg-[var(--surface)]/90 px-3 py-1.5 text-xs font-medium text-[var(--color-muted)] ring-1 ring-[var(--color-border)]/40 backdrop-blur-sm sm:text-sm"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 opacity-0 sm:flex-row animate-delay-4">
          <Link
            href="/contact"
            className="btn-primary group relative w-full rounded-full bg-[var(--color-primary)] px-8 py-4 text-base font-semibold text-[var(--background)] sm:w-auto"
          >
            <span className="relative z-10">Book free consultation</span>
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
          <Link
            href="/#case-studies"
            className="w-full rounded-full border border-[var(--color-border)] px-8 py-4 text-base font-semibold text-white transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-muted)] sm:w-auto"
          >
            See results
          </Link>
        </div>

        <p className="animate-fade-up mt-5 text-center text-sm text-[var(--color-muted)] opacity-0 animate-delay-4">
          No pitch, no pressure
        </p>
      </div>
    </section>
  );
}
