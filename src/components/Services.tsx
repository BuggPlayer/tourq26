import Image from "next/image";

const services = [
  {
    title: "Mobile App Development",
    description:
      "Native and cross-platform apps that users love. iOS, Android, and React Native—built for performance and scale.",
    result: "Faster time-to-market, lower total cost",
    icon: "/images/icons/mobile.svg",
  },
  {
    title: "Web Development",
    description:
      "Fast, scalable web applications and sites. From landing pages to full-stack platforms with modern frameworks.",
    result: "Sites that convert and scale with you",
    icon: "/images/icons/web.svg",
  },
  {
    title: "AI Solutions",
    description:
      "Intelligent automation, chatbots, and data-driven insights. Leverage AI to streamline operations and delight users.",
    result: "Higher efficiency, better customer experience",
    icon: "/images/icons/ai.svg",
  },
  {
    title: "Remote IT Resources",
    description:
      "Dedicated developers and teams that integrate seamlessly. Scale your capacity without the overhead.",
    result: "Elastic capacity, no hiring delays",
    icon: "/images/icons/team.svg",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative border-t border-[var(--color-border)]/50 bg-[var(--surface)] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-primary)]">
            What we do
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Services that deliver results
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--color-muted)]">
            End-to-end digital capabilities—from idea to launch and beyond.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="card-hover group rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface-elevated)] p-6"
            >
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 text-[var(--color-primary)] transition-transform group-hover:scale-110"
                aria-hidden
              >
                <Image src={service.icon} alt="" width={28} height={28} className="opacity-90" unoptimized />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                {service.description}
              </p>
              <p className="mt-4 border-t border-[var(--color-border)]/50 pt-4 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                Result: {service.result}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
