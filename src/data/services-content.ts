export type ServiceSection = { heading: string; body: string };

export type ServicePageContent = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: ServiceSection[];
  faqs: { question: string; answer: string }[];
  relatedBlogSlugs?: string[];
};

export const servicePages: ServicePageContent[] = [
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    description:
      "Native iOS & Android and cross-platform delivery for startups and enterprises. Architecture, security, store submission, and long-term maintenance—how Torq Studio ships production-ready apps.",
    h1: "Mobile app development that ships—and scales",
    intro:
      "Whether you are launching a consumer product, a field workforce tool, or a regulated financial app, mobile delivery is about more than screens. It is performance on real devices, predictable releases, and an architecture that does not trap you after v1.",
    sections: [
      {
        heading: "When clients choose native vs cross-platform",
        body:
          "<p><strong>Native (Swift/Kotlin)</strong> fits when you need maximum control over platform APIs, complex animations, or long-term alignment with Apple and Google guidelines. <strong>Cross-platform (e.g. React Native, Flutter)</strong> fits when you want one team and shared business logic across iOS and Android, with acceptable trade-offs on edge-case platform behaviour.</p><p>We help you decide based on team skills, timeline, and risk—not dogma.</p>",
      },
      {
        heading: "What “done” looks like in our engagements",
        body:
          "<ul><li>Clear product and technical discovery, with documented assumptions.</li><li>Incremental releases (internal, TestFlight, closed beta) before public launch.</li><li>Automated builds, environment separation, and crash/analytics hooks.</li><li>QA plans that include device matrix, accessibility basics, and regression around payments or auth.</li><li>Handover documentation and optional ongoing support.</li></ul>",
      },
      {
        heading: "Security and compliance (without buzzwords)",
        body:
          "<p>We treat secrets, tokens, and PII according to least-privilege principles. For regulated industries we align early with your security and legal stakeholders on data flows, third-party SDKs, and logging—so store review and enterprise questionnaires do not become last-minute fire drills.</p>",
      },
      {
        heading: "Engagement models",
        body:
          "<p><strong>Fixed-scope MVP:</strong> best when requirements are bounded and you need a date. <strong>Dedicated squad:</strong> best when you are iterating quickly post-launch. We are transparent about trade-offs so procurement and engineering stay aligned.</p>",
      },
    ],
    faqs: [
      {
        question: "How long does it take to build a mobile app?",
        answer:
          "It depends on scope, integrations, and compliance needs. A focused MVP often ranges from a few months to half a year; enterprise or regulated apps can take longer. We provide a roadmap after discovery, not a guess before we understand the problem.",
      },
      {
        question: "Do you handle App Store and Google Play submission?",
        answer:
          "Yes. We prepare listings, screenshots guidance, privacy labels, and submission packages, and we support you through review feedback. You retain ownership of the developer accounts.",
      },
      {
        question: "Can you take over an existing codebase?",
        answer:
          "Often yes. We start with a short technical assessment: architecture, test coverage, dependency health, and release process. Then we propose either stabilisation sprints or a controlled rewrite if technical debt blocks the roadmap.",
      },
      {
        question: "Will we own the source code and IP?",
        answer:
          "Under our standard agreements, you own the deliverables for work you pay for, subject to contract terms. We recommend explicit IP clauses in the SOW—something we are happy to align with your legal team.",
      },
    ],
    relatedBlogSlugs: ["how-to-choose-mobile-app-development-partner"],
  },
  {
    slug: "web-development",
    title: "Web Development",
    description:
      "High-performance marketing sites, SaaS web apps, and APIs. SSR/SSG, design systems, observability, and SEO-friendly foundations—how we build web products for growth teams.",
    h1: "Web development for conversion, scale, and clean APIs",
    intro:
      "Your website and web app are revenue infrastructure. We build experiences that load fast, rank sensibly, and integrate with CRM, payments, and data pipelines—without sacrificing maintainability.",
    sections: [
      {
        heading: "Frontends that product teams can evolve",
        body:
          "<p>We favour component-driven UIs, typed APIs, and design tokens where appropriate so marketing and product can ship iterations without constant rewrites. Performance budgets and Core Web Vitals are part of delivery, not an afterthought.</p>",
      },
      {
        heading: "APIs your partners can trust",
        body:
          "<p>Public or partner APIs need versioning, documentation, and observability. We use contract-first patterns (e.g. OpenAPI) when multiple teams consume the same surface, and we plan migrations instead of breaking integrators silently.</p>",
      },
      {
        heading: "CMS and content-led sites",
        body:
          "<p>For marketing-heavy properties we separate content from presentation so editors move fast. Technical SEO—metadata, sitemaps, structured data—is implemented in code, not left to plugins alone.</p><p>We also ship <strong>Torq DevTools</strong> as a separate product: free browser-based utilities (JSON tools, hashing, converters) for quick checks alongside production codebases.</p>",
      },
      {
        heading: "How we work with your stack",
        body:
          "<p>We integrate with your Git, CI, and cloud accounts where required. For greenfield work we recommend boring, well-supported tooling so hiring and handover stay practical.</p>",
      },
    ],
    faqs: [
      {
        question: "Next.js, WordPress, or something else?",
        answer:
          "We choose based on your goals. Marketing sites with editorial workflows may suit a headless CMS + modern framework. Heavy SaaS UIs often suit a full-stack framework with strong SSR and API routes. We explain trade-offs instead of defaulting to one stack.",
      },
      {
        question: "Can you improve our Core Web Vitals?",
        answer:
          "Yes. We profile LCP, CLS, and INP, then fix image delivery, font loading, hydration issues, and server response times as needed. We verify in production-like conditions, not only local laptops.",
      },
      {
        question: "Do you build design systems?",
        answer:
          "We can implement from Figma, or collaborate with your designers to establish tokens, components, and documentation so engineering and design share one language.",
      },
      {
        question: "How do you price web projects?",
        answer:
          "Typically milestone-based for defined scopes, or monthly for retained squads. We scope discovery separately when requirements are still fuzzy—so estimates reflect reality.",
      },
    ],
    relatedBlogSlugs: ["benefits-of-remote-it-teams-for-startups"],
  },
  {
    slug: "ai-solutions",
    title: "AI Solutions",
    description:
      "Practical AI for support, operations, and product features: retrieval, automation, evaluation, and safe rollout. When to fine-tune, when to integrate APIs, and how to measure quality.",
    h1: "AI solutions grounded in workflows—not hype",
    intro:
          "Generative AI is useful when tied to measurable outcomes: fewer tickets, faster research, or new product capabilities. We focus on data boundaries, evaluation, and human-in-the-loop patterns so you can scale safely.",
    sections: [
      {
        heading: "Start from the job to be done",
        body:
          "<p>We map the workflow end-to-end: inputs, decisions, exceptions, and compliance constraints. If a deterministic rule or API can solve 80% of the volume, we do that first and use models where judgment or language adds value.</p>",
      },
      {
        heading: "Retrieval, tools, and guardrails",
        body:
          "<p>For knowledge-heavy tasks we combine retrieval with citation-friendly patterns where possible. For operational tasks we integrate with ticketing, CRM, or internal APIs so the system acts on facts, not hallucinated state.</p>",
      },
      {
        heading: "Evaluation before expansion",
        body:
          "<p>Pilots include acceptance metrics: suggestion adoption, edit rate, escalation rate, and latency. We expand scope only when numbers justify it—avoiding organisation-wide rollouts on day one.</p>",
      },
      {
        heading: "Privacy and vendor choices",
        body:
          "<p>We align on data residency, retention, and whether prompts may leave your boundary. Architecture choices (self-hosted vs API) follow those constraints—not the other way around.</p>",
      },
    ],
    faqs: [
      {
        question: "Should we fine-tune a model?",
        answer:
          "Not always. Many use cases succeed with prompting, retrieval, and structured outputs on a strong general model. Fine-tuning can help for stable tone, specialised vocabulary, or classification—after you have enough quality-labelled data.",
      },
      {
        question: "How do you prevent hallucinations in customer-facing flows?",
        answer:
          "We combine constrained prompts, retrieval from approved sources, human review for high-risk categories, and logging to catch drift. The goal is not zero mistakes—it is controlled risk and fast detection.",
      },
      {
        question: "Can AI work with our legacy systems?",
        answer:
          "Usually yes, via APIs, RPA-style bridges, or read-only exports—depending on latency and reliability needs. We document failure modes so support teams know what to do when an integration is down.",
      },
      {
        question: "What does an AI project cost?",
        answer:
          "Pilots are often scoped in weeks; production hardening depends on traffic, compliance, and integrations. We provide a phased estimate after a short discovery so you can fund incrementally.",
      },
    ],
    relatedBlogSlugs: ["ai-solutions-for-business-when-to-invest"],
  },
  {
    slug: "remote-it",
    title: "Remote IT & Dedicated Teams",
    description:
      "Embedded engineers and squads that work in your tools and cadence. Staff augmentation vs dedicated team, governance, and how to hit velocity without losing quality.",
    h1: "Remote IT teams that feel embedded—not outsourced",
    intro:
          "Capacity should not mean chaos. We place senior engineers who adopt your rituals, code standards, and security practices—so you scale delivery without a second shadow engineering culture.",
    sections: [
      {
        heading: "Staff augmentation vs dedicated squad",
        body:
          "<p><strong>Augmentation</strong> adds capacity to an existing team with your tech lead driving priorities. A <strong>dedicated squad</strong> owns a roadmap slice end-to-end with a Torq lead—better when you need throughput but lack local management bandwidth. We help pick the model that matches your governance maturity.</p>",
      },
      {
        heading: "Onboarding that pays off in two weeks",
        body:
          "<p>We use a standard playbook: repo access, environment parity, coding guidelines, incident and deploy procedures, and a small first ticket to prove the loop. Knowledge transfer is documented, not tribal.</p>",
      },
      {
        heading: "Quality and security expectations",
        body:
          "<p>We enforce code review, automated tests where appropriate, and least-privilege access to your systems. For regulated clients we align on device policies, VPN usage, and audit trails.</p>",
      },
      {
        heading: "Commercial models",
        body:
          "<p>Monthly retainers with clear FTE equivalents are most common. We avoid open-ended “time and materials forever” without milestones—both sides deserve predictable outcomes.</p>",
      },
    ],
    faqs: [
      {
        question: "What time zones do you cover?",
        answer:
          "We structure overlap with your core hours—typically several hours of real-time collaboration daily for most engagements, with async updates to cover the rest.",
      },
      {
        question: "How quickly can engineers start?",
        answer:
          "For common stacks, often within two to four weeks after contract and access. Niche skills or clearance-heavy environments may take longer—we are upfront in discovery.",
      },
      {
        question: "Who manages the Torq engineers day to day?",
        answer:
          "You prioritise the backlog; a Torq lead handles craft quality, resourcing, and escalation. For augmentation, your tech lead remains the final authority on architecture decisions unless we agree otherwise.",
      },
      {
        question: "What if we need to scale down?",
        answer:
          "Retainer agreements include notice periods. We plan knowledge transfer so you are not locked in—clean handover is part of professional delivery.",
      },
    ],
    relatedBlogSlugs: ["benefits-of-remote-it-teams-for-startups"],
  },
  {
    slug: "technical-consulting",
    title: "Technical consulting",
    description:
      "Senior software engineer perspective: architecture reviews, build-vs-buy, due diligence, delivery planning, and hands-on guidance—before or alongside implementation.",
    h1: "Technical consulting from engineers who still ship code",
    intro:
      "You may not need a full build yet—you need clarity. We help founders, product leaders, and engineering teams make better decisions: stack choices, team structure, estimates, risk, and what “good” looks like in production.",
    sections: [
      {
        heading: "When consulting is the right first step",
        body:
          "<p>Use a consulting engagement when you are <strong>pre-funding</strong>, <strong>evaluating vendors</strong>, <strong>recovering from a stalled project</strong>, or <strong>planning a rewrite</strong>. Short, focused work reduces expensive mistakes later.</p>",
      },
      {
        heading: "What we typically deliver",
        body:
          "<ul><li><strong>Architecture &amp; roadmap:</strong> diagrams, trade-offs, phased plan.</li><li><strong>Code / system review:</strong> security, performance, maintainability hotspots.</li><li><strong>Vendor or hire support:</strong> interview rubrics, RFP review, estimate sanity checks.</li><li><strong>Fractional technical leadership:</strong> steering meetings, backlog shaping, release discipline.</li></ul>",
      },
      {
        heading: "How engagements are structured",
        body:
          "<p>We start with a free 30-minute call to align on goals. Paid discovery is usually a small fixed package (e.g. a few days) with written outputs you own. Ongoing advisory can be monthly hours or tied to a delivery engagement.</p>",
      },
      {
        heading: "Consulting plus delivery",
        body:
          "<p>Many clients begin with consulting and continue with Torq for mobile, web, or AI implementation—same senior engineers, no handoff cliff. You can also take our recommendations to your in-house team; we are not tied to selling unnecessary build work.</p>",
      },
    ],
    faqs: [
      {
        question: "Do you only advise, or do you also build?",
        answer:
          "Both. Some clients want a written assessment only; others want us to execute. We are clear up front which mode we are in so expectations stay aligned.",
      },
      {
        question: "Is this a substitute for a full-time CTO?",
        answer:
          "It can complement one—or stand in for early-stage teams that are not ready to hire. We focus on pragmatic decisions and documentation your future hires can use.",
      },
      {
        question: "What industries do you work with?",
        answer:
          "We are stack- and problem-driven more than industry-specific. Fintech, logistics, e-commerce, and B2B SaaS are common, but the same principles apply across domains.",
      },
      {
        question: "How is consulting priced?",
        answer:
          "Typically a fixed fee for a defined deliverable (e.g. review + report) or a monthly retainer for ongoing access. We quote after a short scoping conversation.",
      },
    ],
    relatedBlogSlugs: [
      "technical-debt-refactor-rewrite-or-strangle",
      "software-estimation-fixed-price-vs-phased",
      "rfp-custom-software-how-to-write-one",
    ],
  },
];

export function getServicePage(slug: string): ServicePageContent | undefined {
  return servicePages.find((p) => p.slug === slug);
}
