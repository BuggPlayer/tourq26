import Link from "next/link";

export default function Hero() {
  return (
    <section className="gradient-mesh relative min-h-[90vh] flex flex-col items-center justify-center px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <p className="animate-fade-up text-sm font-medium uppercase tracking-widest text-[var(--color-primary)] opacity-0 animate-delay-1">
          Your trusted technology partner
        </p>
        <h1 className="animate-fade-up mt-4 font-display text-4xl font-bold leading-tight text-white opacity-0 sm:text-5xl md:text-6xl lg:text-7xl animate-delay-2">
          Scale smarter & faster{" "}
          <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
            globally
          </span>
        </h1>
        <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg text-[var(--color-muted)] opacity-0 sm:text-xl animate-delay-3">
          We turn ideas into results: mobile apps, web, AI & remote IT—delivered
          on time. Join teams already saving up to{" "}
          <span className="font-semibold text-white">40% on development costs</span>.
        </p>
        <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 opacity-0 sm:flex-row animate-delay-4">
          <Link
            href="#contact"
            className="btn-primary w-full rounded-full bg-[var(--color-primary)] px-8 py-4 text-base font-semibold text-[var(--background)] sm:w-auto"
          >
            Get your free consultation
          </Link>
          <Link
            href="#case-studies"
            className="w-full rounded-full border border-[var(--color-border)] px-8 py-4 text-base font-semibold text-white transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-muted)] sm:w-auto"
          >
            See our results
          </Link>
        </div>
        <p className="animate-fade-up mt-6 text-center text-sm text-[var(--color-muted)] opacity-0 animate-delay-4">
          No commitment · Discuss your goals in 30 min
        </p>
      </div>
    </section>
  );
}
