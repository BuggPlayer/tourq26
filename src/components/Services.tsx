import Image from "next/image";
import Link from "next/link";

const services: {
  slug: string;
  title: string;
  description: string;
  result: string;
  icon: string;
}[] = [
  {
    slug: "mobile-app-development",
    title: "Mobile Apps",
    description: "Native & cross-platform—iOS, Android, React Native. Built for performance and scale.",
    result: "Faster launch, lower cost",
    icon: "/images/icons/mobile.svg",
  },
  {
    slug: "web-development",
    title: "Web & APIs",
    description: "Fast, scalable sites and platforms. Landing pages to full-stack products.",
    result: "Convert and scale",
    icon: "/images/icons/web.svg",
  },
  {
    slug: "ai-solutions",
    title: "AI Solutions",
    description: "Automation, chatbots, data insights. Streamline operations and delight users.",
    result: "Efficiency & better CX",
    icon: "/images/icons/ai.svg",
  },
  {
    slug: "remote-it",
    title: "Remote IT",
    description: "Dedicated devs and teams that slot in. Scale capacity without hiring delays.",
    result: "Elastic capacity",
    icon: "/images/icons/team.svg",
  },
  {
    slug: "technical-consulting",
    title: "Consulting",
    description: "Architecture, code reviews, estimates, and leadership—directly from senior engineers.",
    result: "Clarity before code",
    icon: "/images/icons/web.svg",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative border-t border-[var(--color-border)]/40 bg-[var(--surface)] py-20 sm:py-24 lg:py-28 overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-72 opacity-20 xl:opacity-25" aria-hidden>
        <Image src="/images/section-services.svg" alt="" width={400} height={280} className="h-auto w-full" unoptimized />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-primary)]">
            What we do
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Services that deliver
          </h2>
          <p className="mt-4 text-[var(--color-muted)]">
            Based in Mumbai—React Native + Node, fixed-price MVPs, and consulting with India / EU / MENA overlap.
          </p>
          <Link
            href="/services"
            className="mt-4 inline-block text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            Full service overviews & FAQs →
          </Link>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 xl:grid-cols-5">
          {services.map((service) => (
            <div
              key={service.title}
              className="card-hover group flex flex-col rounded-2xl border border-[var(--color-border)]/40 bg-[var(--surface-elevated)] p-6"
            >
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/15 text-[var(--color-primary)] transition-transform duration-300 group-hover:scale-110"
                aria-hidden
              >
                <Image src={service.icon} alt="" width={28} height={28} className="opacity-90" unoptimized />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)] flex-1">
                {service.description}
              </p>
              <p className="mt-4 border-t border-[var(--color-border)]/40 pt-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                {service.result}
              </p>
              <Link
                href={`/services/${service.slug}`}
                className="mt-4 text-sm font-semibold text-white/90 hover:text-[var(--color-primary)]"
              >
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
