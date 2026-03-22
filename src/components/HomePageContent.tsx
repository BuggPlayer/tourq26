/**
 * Visible editorial copy for the homepage — improves text-to-code ratio for crawlers
 * while staying useful for readers (process, scope, and how we work).
 */
export default function HomePageContent() {
  return (
    <section
      className="border-t border-[var(--color-border)]/40 bg-[var(--background)] py-16 sm:py-20"
      aria-labelledby="homepage-about-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2
          id="homepage-about-heading"
          className="font-display text-2xl font-bold text-white sm:text-3xl"
        >
          How we work with product and engineering teams
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
          Torq Studio is a senior-engineering-led practice focused on shipping software you can run in production—not
          slide decks that never become code. Whether you are validating an MVP, replacing a fragile legacy stack, or
          adding capacity without a six-month hiring cycle, we start from constraints: timeline, risk, compliance, and
          the skills you already have in-house. That keeps estimates honest and avoids the pattern where scope silently
          doubles after kickoff.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
          Our typical engagements combine <strong className="font-semibold text-white/90">mobile applications</strong>,{" "}
          <strong className="font-semibold text-white/90">websites and web platforms</strong>,{" "}
          <strong className="font-semibold text-white/90">APIs and integrations</strong>, and{" "}
          <strong className="font-semibold text-white/90">practical AI automation</strong> where there is a measurable
          workflow to improve. We are comfortable working alongside your designers and product owners, joining stand-ups,
          and documenting decisions so your team can maintain the system long term. When advisory is the right first
          step—architecture review, vendor diligence, or rescue assessment—we say so upfront instead of pushing a build
          contract you are not ready for.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
          Delivery quality depends on clarity. We use written scope, acceptance criteria, and milestone checkpoints so
          stakeholders see progress every week. Security and privacy expectations are discussed early, especially for
          apps that handle accounts, payments, or regulated data. Testing, monitoring hooks, and release practices are
          treated as part of the product, not an afterthought. If you are comparing agencies, freelancers, and in-house
          hires, our case studies and blog outline how we think about trade-offs—so you can decide if we are a fit
          before the first invoice.
        </p>
        <h3 className="mt-10 font-display text-lg font-semibold text-white">Common reasons teams reach out</h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
          <li>You need a senior engineer to own a mobile or web MVP with a fixed scope and predictable milestones.</li>
          <li>Your platform needs new APIs, performance work, or a careful modernization without breaking integrations.</li>
          <li>You want AI-assisted workflows—support, operations, or internal tools—with logging and human review.</li>
          <li>You need an embedded remote squad that works in your repos and communication channels like part of the team.</li>
          <li>You want a second opinion on estimates, technical risk, or build-vs-buy before committing budget.</li>
        </ul>
        <p className="mt-8 text-sm text-[var(--color-muted)] sm:text-base">
          Read detailed write-ups on the{" "}
          <a className="font-medium text-[var(--color-primary)] hover:underline" href="/case-studies">
            case studies
          </a>{" "}
          page, explore{" "}
          <a className="font-medium text-[var(--color-primary)] hover:underline" href="/services">
            services and FAQs
          </a>
          , or{" "}
          <a className="font-medium text-[var(--color-primary)] hover:underline" href="/contact">
            book a free consultation
          </a>{" "}
          to discuss your roadmap.
        </p>
      </div>
    </section>
  );
}
