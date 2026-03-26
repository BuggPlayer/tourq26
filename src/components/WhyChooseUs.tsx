import Image from "next/image";

const reasons = [
  {
    stat: "40%",
    title: "Lower costs",
    description: "Efficient processes and remote talent. More budget for growth, less waste.",
  },
  {
    stat: "100%",
    title: "On-time delivery",
    description: "We commit to deadlines and rigorous testing. Ship with confidence.",
  },
  {
    stat: "—",
    title: "Ideas → solutions",
    description: "Senior engineers who get both tech and business. Your vision, our execution.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="relative border-t border-border/40 py-20 sm:py-24 lg:py-28 overflow-hidden">
      {/* Section visual */}
      <div className="pointer-events-none absolute left-0 bottom-0 w-64 opacity-15 xl:w-80" aria-hidden>
        <Image
          src="/images/why-choose-visual.svg"
          alt="Illustration highlighting quality, transparency, and engineering partnership"
          width={320}
          height={200}
          className="h-auto w-full"
          unoptimized
        />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Why choose us
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            Built for results
          </h2>
          <p className="mt-4 text-muted-foreground">
            We craft solutions that drive growth—not just apps and websites.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {reasons.map((item) => (
            <div
              key={item.title}
              className="card-hover flex flex-col rounded-2xl border border-border/40 bg-surface p-6 sm:p-8"
            >
              <span
                className="stat-number inline-flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold tabular-nums"
                style={{
                  background: "linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(167, 139, 250, 0.15) 100%)",
                }}
                aria-hidden
              >
                {item.stat}
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground sm:text-xl">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-muted-foreground leading-relaxed text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
