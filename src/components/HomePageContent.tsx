/**
 * Homepage editorial copy — depth for readers and crawlers (text-to-code ratio).
 * Structured as a single <article> with minimal wrapper churn.
 */
const prose =
  "text-sm leading-relaxed text-muted-foreground sm:text-base [&_strong]:font-semibold [&_strong]:text-foreground/90";

export default function HomePageContent() {
  return (
    <section
      className="border-t border-border/40 bg-background py-16 sm:py-20"
      aria-labelledby="homepage-about-heading"
    >
      <article className={`mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 ${prose}`}>
        <h2 id="homepage-about-heading" className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          How we work with product and engineering teams
        </h2>
        <p className="mt-5">
          Torq Studio is a senior-engineering-led practice focused on shipping software you can run in production—not
          slide decks that never become code. Whether you are validating an MVP, replacing a fragile legacy stack, or
          adding capacity without a six-month hiring cycle, we start from constraints: timeline, risk, compliance, and
          the skills you already have in-house. That keeps estimates honest and avoids the pattern where scope silently
          doubles after kickoff.
        </p>
        <p className="mt-4">
          Our typical engagements combine <strong>mobile applications</strong>, <strong>websites and web platforms</strong>,{" "}
          <strong>APIs and integrations</strong>, and <strong>practical AI automation</strong> where there is a measurable
          workflow to improve. We are comfortable working alongside your designers and product owners, joining stand-ups,
          and documenting decisions so your team can maintain the system long term. When advisory is the right first
          step—architecture review, vendor diligence, or rescue assessment—we say so upfront instead of pushing a build
          contract you are not ready for.
        </p>
        <p className="mt-4">
          Delivery quality depends on clarity. We use written scope, acceptance criteria, and milestone checkpoints so
          stakeholders see progress every week. Security and privacy expectations are discussed early, especially for
          apps that handle accounts, payments, or regulated data. Testing, monitoring hooks, and release practices are
          treated as part of the product, not an afterthought. If you are comparing agencies, freelancers, and in-house
          hires, our case studies and blog outline how we think about trade-offs—so you can decide if we are a fit
          before the first invoice.
        </p>

        <h3 className="mt-10 font-display text-lg font-semibold text-foreground">Engagement models that match the risk</h3>
        <p className="mt-4">
          Not every problem should start as a multi-month build. When the scope is bounded and the acceptance criteria can
          be written down, a <strong>fixed-price or milestone MVP</strong> gives finance and leadership predictable spend
          and a clear definition of done. When you are past v1 and need steady velocity—features, hardening, integrations—a{" "}
          <strong>retainer or embedded squad</strong> often fits better than endless change orders. For leadership that
          needs confidence before funding a build, we offer <strong>paid discovery</strong> and short advisory blocks:
          document the current system, flag risks, produce a roadmap, and only then recommend build options.
        </p>
        <p className="mt-4">
          Remote collaboration is standard. We align on overlap hours for reviews and incidents, use your issue tracker
          and repos where appropriate, and keep communication in writing so decisions survive team changes. For regulated
          or security-sensitive work, we respect your access policies, NDAs, and vendor questionnaires from day one.
        </p>

        <h3 className="mt-10 font-display text-lg font-semibold text-foreground">Where we add the most value</h3>
        <p className="mt-4">
          Teams usually bring us in when delivery risk is high: consumer or B2B <strong>mobile apps</strong> that must
          pass store review and handle real traffic; <strong>web platforms</strong> where SEO, performance, and admin UX
          all matter; <strong>public or partner APIs</strong> that cannot break existing integrations; and{" "}
          <strong>AI-assisted workflows</strong> that need evaluation metrics—not a chatbot demo that falls apart in
          production. We have worked with patterns common in fintech, logistics, retail, and B2B SaaS, but the deciding
          factor is always whether the engineering and product problem is concrete enough to scope.
        </p>
        <p className="mt-4">
          We are not the right fit when you need a generic “we do everything” vendor, a race-to-the-bottom quote with no
          ownership, or a team that will disappear after handoff without documentation. If your goal is lowest hourly
          rate regardless of outcome, you will find cheaper options—we optimize for <strong>senior judgment</strong>,{" "}
          <strong>maintainable code</strong>, and <strong>clear accountability</strong>.
        </p>

        <h3 className="mt-10 font-display text-lg font-semibold text-foreground">Engineering practices you can audit</h3>
        <p className="mt-4">
          Before launch we care about automated tests where they buy confidence (critical paths, payments, auth), manual
          exploratory testing for edge cases, and realistic device or browser coverage for your audience. We favour small,
          reversible releases over big-bang deploys when the stack allows it. Observability—structured logs, error
          reporting, basic dashboards—is discussed early so you are not blind the week after go-live. Handover includes
          READMEs, runbooks for operators, and walkthroughs for your engineers so knowledge is not trapped in one person.
        </p>

        <h3 className="mt-10 font-display text-lg font-semibold text-foreground">Common reasons teams reach out</h3>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>You need a senior engineer to own a mobile or web MVP with a fixed scope and predictable milestones.</li>
          <li>Your platform needs new APIs, performance work, or a careful modernization without breaking integrations.</li>
          <li>You want AI-assisted workflows—support, operations, or internal tools—with logging and human review.</li>
          <li>You need an embedded remote squad that works in your repos and communication channels like part of the team.</li>
          <li>You want a second opinion on estimates, technical risk, or build-vs-buy before committing budget.</li>
        </ul>

        <h3 className="mt-10 font-display text-lg font-semibold text-foreground">Terms buyers ask about</h3>
        <dl className="mt-4 space-y-4 border-t border-border/30 pt-6">
          <div>
            <dt className="font-medium text-foreground">MVP (minimum viable product)</dt>
            <dd className="mt-1 pl-0 sm:pl-0">
              The smallest version that proves value to users and stakeholders, with explicit out-of-scope items so the
              timeline is defensible.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Technical debt</dt>
            <dd className="mt-1">
              Shortcuts taken under time pressure; we help you decide when to pay it down versus when it is acceptable
              risk for a learning phase.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">API versioning</dt>
            <dd className="mt-1">
              A strategy so mobile apps and partners can migrate without surprise breaking changes—often paired with
              documentation and sunset timelines.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Retrieval-augmented AI</dt>
            <dd className="mt-1">
              Patterns where a model is grounded in your approved content or tools instead of hallucinating policies or
              live data it cannot see.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Embedded team</dt>
            <dd className="mt-1">
              Engineers who work inside your rituals and systems with shared ownership, as opposed to throwing specs over
              a wall every sprint.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">Production readiness</dt>
            <dd className="mt-1">
              Checklist-style concerns: backups, secrets handling, rate limits, monitoring, rollback paths, and support
              expectations after launch.
            </dd>
          </div>
        </dl>

        <p className="mt-10">
          Read detailed write-ups on the{" "}
          <a className="font-medium text-primary hover:underline" href="/case-studies">
            case studies
          </a>{" "}
          page, explore{" "}
          <a className="font-medium text-primary hover:underline" href="/services">
            services and FAQs
          </a>
          , browse the{" "}
          <a className="font-medium text-primary hover:underline" href="/blog">
            blog
          </a>{" "}
          for longer-form guides, or{" "}
          <a className="font-medium text-primary hover:underline" href="/contact">
            book a free consultation
          </a>{" "}
          to discuss your roadmap.
        </p>
      </article>
    </section>
  );
}
