const reasons = [
  {
    stat: "40%",
    title: "Reduce development costs",
    description: "Efficient processes and remote talent without compromising quality. More budget for growth, less waste.",
  },
  {
    stat: "100%",
    title: "On-time delivery, quality assured",
    description: "We commit to deadlines and rigorous testing so you ship with confidence. No surprises.",
  },
  {
    stat: "✓",
    title: "Ideas turned into solutions",
    description: "Senior engineers and designers who understand both tech and business. Your vision, our execution.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="relative border-t border-[var(--color-border)]/50 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-primary)]">
            Why choose us
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Built for results
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--color-muted)]">
            We don’t just build apps & websites—we craft solutions that drive
            growth & innovation.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {reasons.map((item) => (
            <div
              key={item.title}
              className="card-hover flex flex-col rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface)] p-6 sm:p-8"
            >
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold tabular-nums"
                style={{
                  background: "linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(139, 92, 246, 0.2) 100%)",
                  color: "var(--color-primary)",
                }}
                aria-hidden
              >
                {item.stat}
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-white sm:text-xl">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-[var(--color-muted)] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
