import Link from "next/link";
import Image from "next/image";
import { sitePhotos } from "@/data/site-photos";

const solutions = [
  "Mobile apps",
  "Websites & web apps",
  "AI & automation",
  "Technical consulting",
  "Integrations",
  "Custom software",
];

export default function Hero() {
  const { src, alt } = sitePhotos.hero;
  return (
    <section className="hero-section relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-4 pt-28 pb-24 sm:px-6 lg:px-8">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-80 w-80 rounded-full bg-primary/15 blur-[120px]" aria-hidden />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-accent/12 blur-[100px]" aria-hidden />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="text-center lg:text-left">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary-muted px-4 py-2 text-sm font-medium text-primary opacity-0 animate-delay-1 lg:inline-flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Free 30-min consultation
          </div>

          <h1 className="animate-fade-up mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground opacity-0 sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl animate-delay-2">
            Senior engineers for{" "}
            <span className="bg-gradient-to-r from-primary via-primary-hover to-accent bg-clip-text text-transparent">
              your product & stack.
            </span>
          </h1>
          <p className="animate-fade-up mx-auto mt-5 max-w-xl text-base text-muted-foreground opacity-0 sm:text-lg animate-delay-3 lg:mx-0">
            Mobile apps, websites, AI, and technical consulting—<span className="text-foreground/90">you work with experienced engineers</span>, not a black box. Book a free call to scope what you need.
          </p>

          <div className="animate-fade-up mt-6 flex flex-wrap items-center justify-center gap-2 opacity-0 sm:gap-3 animate-delay-3 lg:justify-start">
            {solutions.map((item) => (
              <span
                key={item}
                className="rounded-full bg-surface/90 px-3 py-1.5 text-xs font-medium text-muted-foreground ring-1 ring-border/40 backdrop-blur-sm sm:text-sm"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 opacity-0 sm:flex-row animate-delay-4 lg:justify-start">
            <Link
              href="/contact"
              className="btn-primary group relative w-full rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground sm:w-auto"
            >
              <span className="relative z-10">Book free consultation</span>
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary-hover opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <Link
              href="/#case-studies"
              className="w-full rounded-full border border-border px-8 py-4 text-base font-semibold text-foreground transition-all hover:border-primary hover:bg-primary-muted sm:w-auto"
            >
              See results
            </Link>
          </div>

          <p className="animate-fade-up mt-5 text-center text-sm text-muted-foreground opacity-0 animate-delay-4 lg:text-left">
            Straight talk · Build, advise, or both
          </p>
        </div>

        <div className="animate-fade-up relative mx-auto w-full max-w-lg opacity-0 animate-delay-2 lg:max-w-none">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/50 bg-surface shadow-2xl ring-1 ring-foreground/5">
            <Image
              src={src}
              alt={alt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/25 via-transparent to-accent/15"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}
