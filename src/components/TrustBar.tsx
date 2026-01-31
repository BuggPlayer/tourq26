const stats = [
  { value: "40%", label: "Cost reduction" },
  { value: "100%", label: "On-time delivery" },
  { value: "50+", label: "Projects delivered" },
  { value: "Global", label: "Reach" },
];

const regions = ["Americas", "Europe", "Middle East", "Asia", "Africa"];

export default function TrustBar() {
  return (
    <section
      className="border-y border-[var(--color-border)]/50 bg-[var(--surface)]"
      aria-label="Results and reach"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
          Results that matter
        </p>
        <div className="mt-6 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="font-display text-3xl font-bold tabular-nums sm:text-4xl"
                style={{
                  background: "linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium text-white/90">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-[var(--color-border)]/50 pt-6">
          <p className="text-center text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
            Trusted by businesses worldwide
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-white/90 sm:gap-x-8">
            {regions.map((region) => (
              <span key={region}>{region}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
