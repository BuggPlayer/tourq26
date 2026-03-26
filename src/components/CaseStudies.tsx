import Image from "next/image";
import Link from "next/link";
import { caseStudies } from "@/data/case-studies";

export default function CaseStudies() {
  return (
    <section
      id="case-studies"
      className="relative border-t border-border/40 bg-surface py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Proof in practice
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            Results we’ve delivered
          </h2>
          <p className="mt-4 text-muted-foreground">
            Real projects, real outcomes. Read the full write-ups on our case studies hub.
          </p>
          <Link
            href="/case-studies"
            className="mt-5 inline-block text-sm font-semibold text-primary hover:underline"
          >
            View all case studies →
          </Link>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {caseStudies.map((study) => (
            <article
              key={study.slug}
              className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-surface-elevated"
            >
              <div className="relative h-44 overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] sm:h-48">
                <Image
                  src={study.coverImage}
                  alt={study.coverAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-elevated via-transparent to-transparent"
                  aria-hidden
                />
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <p className="text-xs font-medium uppercase tracking-wider text-primary">
                  {study.industry}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold text-foreground sm:text-xl">
                  {study.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{study.challenge}</p>
                <p className="mt-4 text-sm font-medium text-foreground">
                  <span className="text-primary">Result: </span>
                  {study.outcome}
                </p>
                <div className="mt-5 flex items-center gap-2">
                  <span className="stat-number rounded-full px-4 py-2 text-sm font-bold bg-primary-muted">
                    {study.metric}
                  </span>
                  <span className="text-xs text-muted-foreground">{study.metricLabel}</span>
                </div>
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="mt-6 text-sm font-semibold text-primary hover:underline"
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
