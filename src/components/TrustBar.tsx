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
      className="border-y border-border/40 bg-surface"
      aria-label="Results and reach"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Results that matter
          </span>
          <span className="hidden text-border sm:inline">·</span>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 002.5-2.5V3.935M12 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-medium uppercase tracking-wider">Worldwide</span>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="stat-number font-display text-3xl font-bold tabular-nums sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-border/40 pt-8">
          <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Trusted globally
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-foreground/90 sm:gap-x-10">
            {regions.map((region) => (
              <span key={region} className="transition-colors hover:text-foreground">{region}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
