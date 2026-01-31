const caseStudies = [
  {
    title: "Unified banking app for a regional fintech",
    client: "FinTech · UAE",
    challenge:
      "Needed a secure, scalable mobile app for multiple markets with global compliance.",
    outcome: "Launched on iOS and Android in 6 months. 40% cost savings vs. in-house build.",
    metric: "6 months",
    metricLabel: "Launch time",
    icon: "📱",
  },
  {
    title: "AI-powered customer support platform",
    client: "Logistics · Saudi Arabia",
    challenge:
      "High volume of support tickets; manual handling was slow and costly.",
    outcome: "Custom AI chatbot and workflow automation. 60% faster resolution, 35% cost reduction.",
    metric: "60% faster",
    metricLabel: "Resolution",
    icon: "🤖",
  },
  {
    title: "E-commerce platform and team scaling",
    client: "E-commerce · Germany",
    challenge:
      "Rapid growth required a new platform and more developers without local hiring delays.",
    outcome: "New web platform plus dedicated remote team. Launched in 4 months, ongoing scaling.",
    metric: "4 months",
    metricLabel: "To launch",
    icon: "🌐",
  },
];

export default function CaseStudies() {
  return (
    <section
      id="case-studies"
      className="relative border-t border-[var(--color-border)]/50 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-primary)]">
            Proof in practice
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Results we’ve delivered
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--color-muted)]">
            Real projects, real outcomes. See how we help businesses scale
            smarter.
          </p>
        </div>
        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <article
              key={study.title}
              className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)]/50 bg-[var(--surface)]"
            >
              <div className="flex h-28 items-center justify-center bg-gradient-to-br from-[var(--color-primary-muted)] to-[var(--color-accent)]/10 text-4xl transition-transform group-hover:scale-105">
                {study.icon}
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-primary)]">
                  {study.client}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold text-white sm:text-xl">
                  {study.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--color-muted)] leading-relaxed">
                  {study.challenge}
                </p>
                <p className="mt-4 text-sm font-medium text-white">
                  <span className="text-[var(--color-primary)]">Result: </span>
                  {study.outcome}
                </p>
                <div className="mt-5 flex items-center gap-2">
                  <span
                    className="rounded-full px-4 py-2 text-sm font-bold"
                    style={{
                      background: "linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(139, 92, 246, 0.2) 100%)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {study.metric}
                  </span>
                  <span className="text-xs text-[var(--color-muted)]">
                    {study.metricLabel}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
