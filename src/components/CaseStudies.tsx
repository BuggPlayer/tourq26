import Image from "next/image";
import Link from "next/link";
import { caseStudies } from "@/data/case-studies";

export default function CaseStudies() {
  return (
    <section
      id="case-studies"
      className="relative border-t border-[var(--color-border)]/40 bg-[var(--surface)] py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-primary)]">
            Proof in practice
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Results we’ve delivered
          </h2>
          <p className="mt-4 text-[var(--color-muted)]">
            Real projects, real outcomes. Read the full write-ups on our case studies hub.
          </p>
          <Link
            href="/case-studies"
            className="mt-5 inline-block text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            View all case studies →
          </Link>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {caseStudies.map((study) => (
            <article
              key={study.slug}
              className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)]/40 bg-[var(--surface-elevated)]"
            >
              <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-[var(--color-primary-muted)] via-[var(--color-surface-elevated)] to-[var(--color-accent-muted)] text-[var(--color-primary)] transition-transform duration-300 group-hover:scale-[1.02]">
                <Image src={study.icon} alt="" width={56} height={56} className="opacity-90" unoptimized />
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-primary)]">
                  {study.industry}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold text-white sm:text-xl">
                  {study.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--color-muted)] leading-relaxed">{study.challenge}</p>
                <p className="mt-4 text-sm font-medium text-white">
                  <span className="text-[var(--color-primary)]">Result: </span>
                  {study.outcome}
                </p>
                <div className="mt-5 flex items-center gap-2">
                  <span className="stat-number rounded-full px-4 py-2 text-sm font-bold bg-[var(--color-primary-muted)]">
                    {study.metric}
                  </span>
                  <span className="text-xs text-[var(--color-muted)]">{study.metricLabel}</span>
                </div>
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="mt-6 text-sm font-semibold text-[var(--color-primary)] hover:underline"
                >
                  Read case study →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
