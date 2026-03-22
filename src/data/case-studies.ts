export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  outcome: string;
  metric: string;
  metricLabel: string;
  icon: string;
  /** Cover photo for cards and article header (Unsplash or /public path). */
  coverImage: string;
  coverAlt: string;
  description: string;
  date: string;
  readTime: string;
  services: string[];
  body: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "regional-fintech-banking-app",
    title: "Regional fintech: multi-market banking app on iOS and Android",
    client: "Confidential · FinTech",
    industry: "Financial services · UAE / GCC",
    challenge: "Secure, scalable mobile app for multiple markets and compliance.",
    outcome: "iOS & Android in 6 months. ~40% cost savings vs building entirely in-house.",
    metric: "6 months",
    metricLabel: "Time to store launch",
    icon: "/images/icons/mobile.svg",
    coverImage:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=85&auto=format&fit=crop",
    coverAlt: "Person using a banking or finance app on a smartphone",
    description:
      "How we delivered a compliant, secure mobile banking experience across regions—architecture, security practices, and delivery model.",
    date: "2025-01-15",
    readTime: "7 min read",
    services: ["Mobile app development", "Security & compliance alignment", "QA & release"],
    body: `
<p>Our client needed a consumer-facing banking app that could serve multiple markets without duplicating codebases or compromising on regulatory expectations. The stakes were high: financial data, KYC flows, and app-store policies all had to be handled with discipline from day one.</p>
<h2>Discovery and constraints</h2>
<p>We started with a focused discovery phase: target markets, required authentication flows, card and account features, and non-functional requirements (offline behaviour, crash rates, and audit expectations). The goal was not to build everything at once, but to ship a credible v1 that could scale.</p>
<h2>Architecture and security</h2>
<p>We aligned the mobile architecture with the client’s existing API strategy, enforcing TLS, certificate pinning where appropriate, and clear separation between presentation and domain logic. Sensitive operations were designed around server-side validation—never trusting the client alone for authorisation decisions.</p>
<h2>Compliance and release</h2>
<p>We worked alongside the client’s compliance and legal stakeholders to document data flows, retention, and third-party SDK usage early. That reduced late-stage surprises before store submission. Test plans covered regression on payment-adjacent flows and device matrix coverage for the regions in scope.</p>
<h2>Delivery model</h2>
<p>A hybrid of senior mobile engineers and integrated QA allowed predictable two-week milestones. Compared to staffing a full local team for the same window, the client estimated roughly <strong>40% lower</strong> delivery cost for the first major release while meeting the launch date.</p>
<h2>Results</h2>
<ul><li>Production releases on <strong>iOS and Android</strong> within the agreed six-month window.</li><li>Clear runway for phase-two features (notifications, enhanced analytics) without re-architecting the core app.</li><li>Reduced operational risk through documented processes and test coverage on critical paths.</li></ul>
<p><em>Figures are representative of client-reported outcomes; specific metrics may vary by engagement.</em></p>
    `.trim(),
  },
  {
    slug: "logistics-ai-customer-support",
    title: "Logistics operator: AI-assisted support and ticket automation",
    client: "Confidential · Logistics",
    industry: "Supply chain · Saudi Arabia",
    challenge: "High ticket volume; manual handling was slow, costly, and inconsistent.",
    outcome: "Custom assistant + workflow automation. Faster resolution and measurable cost reduction.",
    metric: "60% faster",
    metricLabel: "Median first response",
    icon: "/images/icons/ai.svg",
    coverImage:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=85&auto=format&fit=crop",
    coverAlt: "Team collaborating on customer support and operations",
    description:
      "Practical AI integration: when to automate, how to measure quality, and how we integrated with existing tools without a rip-and-replace.",
    date: "2024-11-20",
    readTime: "8 min read",
    services: ["AI solutions", "Integrations", "Web backends"],
    body: `
<p>The organisation’s support team was drowning in repetitive enquiries—shipment status, documentation, and exception handling. Hiring linearly was not sustainable. They needed automation that <strong>augmented</strong> agents, not a chatbot that frustrated customers.</p>
<h2>Problem framing</h2>
<p>We categorised ticket types and measured baseline handle time and escalation rates. The highest-volume, lowest-risk categories became candidates for deflection or draft replies. Anything involving liability or account changes stayed with humans, with AI only suggesting text.</p>
<h2>Solution design</h2>
<p>We implemented a retrieval-assisted workflow: the model could pull from approved knowledge sources and CRM snippets, with guardrails on tone and length. For structured requests, we added deterministic automation (webhooks and status APIs) so the assistant did not “guess” live shipment data.</p>
<h2>Quality and governance</h2>
<p>Human review loops and logging were built in from the start. We tracked suggestion acceptance rate, edit distance, and escalation triggers. That gave leadership confidence to expand scope gradually instead of betting on a big-bang go-live.</p>
<h2>Outcomes</h2>
<ul><li><strong>~60% improvement</strong> in median first-response time for eligible ticket categories.</li><li>Estimated <strong>~35% reduction</strong> in cost per ticket for those categories once stable.</li><li>Higher agent satisfaction: less copy-paste, more time on complex cases.</li></ul>
<p>This engagement is a useful pattern for teams asking: “Can AI help our support?” The answer is yes—when scoped to measurable workflows and paired with engineering rigour.</p>
    `.trim(),
  },
  {
    slug: "ecommerce-platform-remote-team",
    title: "E-commerce scale-up: new platform plus embedded remote engineering team",
    client: "Confidential · E-commerce",
    industry: "Retail · DACH",
    challenge: "Replace a limiting legacy stack and grow engineering capacity without long local hiring cycles.",
    outcome: "New platform live in four months; ongoing capacity through a dedicated remote squad.",
    metric: "4 months",
    metricLabel: "MVP to production",
    icon: "/images/icons/web.svg",
    coverImage:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=85&auto=format&fit=crop",
    coverAlt: "E-commerce shopping experience on a tablet",
    description:
      "How we combined a focused platform rebuild with a dedicated team model—ways of working, ownership, and metrics that matter for scale-ups.",
    date: "2024-09-08",
    readTime: "7 min read",
    services: ["Web development", "Remote IT / dedicated team", "DevOps alignment"],
    body: `
<p>Rapid growth had outpaced the existing storefront and admin tooling. The client needed a modern commerce stack, better performance for SEO and conversion, and more engineering throughput—but Germany’s hiring market meant months-long delays for each role.</p>
<h2>Scope and sequencing</h2>
<p>We split work into a <strong>customer-facing storefront</strong> MVP and parallel tracks for catalogue, promotions, and integrations. Cutting scope for v1 was explicit: launch something merchants could sell on, then iterate on back-office efficiency.</p>
<h2>Team model</h2>
<p>A small Torq squad (full-stack and frontend-heavy) operated as an extension of the client’s product org: shared sprint cadence, shared Slack channels, and code ownership in the client’s repos. That reduced the “vendor wall” effect that kills velocity in many outsourcing setups.</p>
<h2>Engineering practices</h2>
<p>CI pipelines, preview environments, and feature flags reduced release risk. We documented API contracts with their ERP partner early to avoid integration thrash in the final month.</p>
<h2>Results</h2>
<ul><li>Production launch in approximately <strong>four months</strong> from kickoff for the defined MVP.</li><li>Sustained velocity post-launch through the same embedded team—no re-onboarding cliff.</li><li>Foundation for international expansion (localisation, payment methods) without another rewrite.</li></ul>
    `.trim(),
  },
  {
    slug: "b2b-saas-api-modernization",
    title: "B2B SaaS: API modernisation without breaking hundreds of integrations",
    client: "Confidential · SaaS",
    industry: "B2B software · Europe",
    challenge: "A decade-old public API was slowing product innovation and worrying enterprise prospects during security reviews.",
    outcome: "Versioned API, migration window, and partner comms—zero emergency rollbacks in cutover.",
    metric: "12 weeks",
    metricLabel: "Core migration program",
    icon: "/images/icons/web.svg",
    coverImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=85&auto=format&fit=crop",
    coverAlt: "Developer working on software at a laptop",
    description:
      "A playbook for evolving public APIs: versioning strategy, sunset policy, and how we helped a SaaS vendor reassure enterprise buyers.",
    date: "2024-07-22",
    readTime: "6 min read",
    services: ["Web & API development", "Technical documentation", "Remote IT"],
    body: `
<p>Enterprise prospects were asking hard questions about authentication patterns, rate limits, and change management. The product team could not ship net-new capabilities cleanly on top of an under-documented, organically grown API surface.</p>
<h2>Strategy</h2>
<p>We recommended a <strong>new major version</strong> rather than silent breaking changes. That sounds obvious, but it requires discipline: parallel operation, clear deprecation timelines, and tooling so integrators could test against a sandbox.</p>
<h2>Execution</h2>
<p>We mapped existing endpoints to the new design, introduced OpenAPI as the contract source of truth, and built migration guides with request/response diffs. Internal services were refactored behind facades so the core domain did not fork.</p>
<h2>Change management</h2>
<p>Partner communications went out in waves: design partners first, then general availability with a 9-month sunset for legacy routes. Support metrics and error rates were monitored daily during the first weeks of each wave.</p>
<h2>Takeaway</h2>
<p>API modernisation is as much <strong>product management</strong> as engineering. When done well, it unlocks sales cycles and reduces support load—without the reputational damage of a chaotic cutover.</p>
    `.trim(),
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
