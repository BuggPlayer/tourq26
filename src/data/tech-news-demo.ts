/**
 * Tech news content — replace with CMS or API in production.
 * Slugs are stable URLs; keep them when migrating.
 */
export type TechNewsItem = {
  slug: string;
  title: string;
  dek: string;
  category: "AI & ML" | "Cloud" | "Security" | "Hardware" | "DevTools" | "Startups";
  datePublished: string;
  readingTimeMinutes: number;
  excerpt: string;
  /** Full article body — rendered as paragraphs (safe, no raw HTML). */
  paragraphs: string[];
};

export const techNewsDemoItems: TechNewsItem[] = [
  {
    slug: "open-models-enterprise-adoption-2025",
    title: "Open-weight LLMs close the gap on closed APIs in enterprise pilots",
    dek: "Benchmarks and procurement data suggest a shift toward hybrid strategies.",
    category: "AI & ML",
    datePublished: "2025-03-18",
    readingTimeMinutes: 6,
    excerpt:
      "Teams are mixing API-only vendors with self-hosted open models for sensitive workloads. Latency, predictable cost, and audit trails are driving architecture reviews away from a single-vendor default.",
    paragraphs: [
      "Enterprise architecture teams are no longer treating large language models as a single choice between a hyperscaler API and nothing at all. Pilot programs through late 2024 and early 2025 show a clear pattern: regulated industries and data-heavy SaaS vendors are standardizing on a hybrid pattern—closed APIs for fast iteration on non-sensitive workloads, and open-weight or self-hosted models where data residency, auditability, and unit economics matter more than raw benchmark scores.",
      "What changed is not only model quality but operational maturity. Quantization, inference servers, and observability tooling for on-prem or VPC deployments have crossed a threshold where engineering leaders can credibly promise SLAs without an army of ML ops hires. Procurement is following: RFPs increasingly ask for exportable weights, fine-tuning rights, and documented training exclusions rather than a black-box subscription alone.",
      "Latency and cost predictability remain the practical drivers. Teams that burst to frontier APIs for experiments but route production traffic through smaller, controlled deployments report fewer surprise bills and cleaner capacity planning. The trade-off—more internal responsibility for safety, evaluation, and rollback—is being accepted where the alternative is an unbounded API line item tied to product usage growth.",
      "For product and platform leaders, the takeaway is architectural: design interfaces and evaluation harnesses so the model backend can swap without rewriting application logic. The organizations winning these pilots treat models as replaceable components under contract, not as permanent infrastructure.",
    ],
  },
  {
    slug: "eu-ai-act-compliance-checklists",
    title: "EU AI Act: what product teams are adding to release gates",
    dek: "Documentation, human oversight, and logging requirements are landing in CI templates.",
    category: "AI & ML",
    datePublished: "2025-03-14",
    readingTimeMinutes: 7,
    excerpt:
      "Engineering leads report folding risk classification and model cards into the same pipelines as security scans. The goal is provable traceability without blocking every experiment.",
    paragraphs: [
      "The EU AI Act’s tiered obligations have moved from legal slide decks into engineering backlogs. Product teams shipping systems that qualify as high-risk—or that sit adjacent to those categories—are embedding compliance checks next to security and accessibility gates rather than treating them as a pre-launch paperwork step.",
      "Model cards, data lineage summaries, and human oversight workflows are increasingly versioned alongside application code. The intent is defensible evidence: who approved deployment, what data distributions were used for training or fine-tuning, and how overrides and appeals work when automated decisions affect users.",
      "CI/CD templates are picking up new hooks: static checks for required documentation fields, automated logging of inference metadata in tamper-evident stores, and feature flags that enforce “human in the loop” paths for certain jurisdictions or customer segments. None of this replaces legal review, but it reduces the gap between stated policy and shipped behavior.",
      "Teams that succeed treat compliance as product quality—measurable, testable, and owned—rather than as an external audit event. That mindset is what keeps release velocity acceptable while regulatory surface area grows.",
    ],
  },
  {
    slug: "finops-kubernetes-rightsizing",
    title: "FinOps meets Kubernetes: rightsizing that survives the next scale-up",
    dek: "Spot, savings plans, and autoscaling policies are being unified in a single dashboard.",
    category: "Cloud",
    datePublished: "2025-03-11",
    readingTimeMinutes: 5,
    excerpt:
      "Platform teams are correlating utilization with business metrics so cost conversations happen before clusters are oversized. Chargeback clarity is finally matching technical reality.",
    paragraphs: [
      "Kubernetes cost debates used to end with “we’ll fix it after the launch.” That tolerance has shrunk. Finance and engineering leadership now expect cluster spend to be explainable in the same vocabulary as revenue per customer and gross margin by product line.",
      "The shift is partly tooling: better allocation of node and pod costs by team, environment, and workload, and partly process. Rightsizing exercises are scheduled like quarterly reliability reviews, with explicit targets for idle capacity and over-provisioned stateful services.",
      "Spot instances, savings plans, and intelligent autoscaling are being orchestrated from a single FinOps view so engineers do not have to guess whether a scheduling change broke a discount commitment. When utilization spikes correlate with a marketing campaign or a new tenant onboarded, finance sees the same graph platform does.",
      "The durable outcome is not the lowest possible bill—it is predictable spend that scales with real usage. That is what keeps platform teams funded and trusted during the next growth phase.",
    ],
  },
  {
    slug: "post-quantum-readiness-tls",
    title: "Post-quantum readiness: TLS and certificate roadmaps for 2026",
    dek: "Hybrid classical and PQC handshakes are entering staging environments.",
    category: "Security",
    datePublished: "2025-03-08",
    readingTimeMinutes: 8,
    excerpt:
      "CISOs are staging dual-stack crypto to avoid a hard cutover. Browser and CDN support timelines are now part of the same planning docs as zero-trust rollouts.",
    paragraphs: [
      "Post-quantum cryptography is no longer a research-only topic for security architecture reviews. Standards bodies and vendors have converged on candidate algorithms and hybrid handshake modes that combine classical and post-quantum key exchange so deployments can migrate without a risky big-bang switch.",
      "Large enterprises are staging dual-stack TLS in non-production environments first: validating performance on mobile clients, ensuring middleboxes and inspection appliances behave, and updating certificate lifecycle automation to handle new key sizes and issuance policies.",
      "Roadmaps through 2026 now explicitly include CDN and browser support matrices, HSM capabilities, and contractual language with vendors on algorithm agility— the ability to swap algorithms without forklift upgrades. That last point is critical for long-lived firmware and embedded systems.",
      "For engineering leaders, the practical message is to treat crypto agility as infrastructure capability: observability for handshake failures, staged rollouts, and documented rollback paths—aligned with zero-trust initiatives rather than competing with them.",
    ],
  },
  {
    slug: "arm-snapdragon-ai-pcs",
    title: "On-device inference gets serious as ARM laptops gain unified NPUs",
    dek: "Developers are shipping smaller models with quantization-first workflows.",
    category: "Hardware",
    datePublished: "2025-03-05",
    readingTimeMinutes: 4,
    excerpt:
      "Battery life and privacy-sensitive inference are pushing more workloads off the cloud for everyday apps. Tooling for ONNX and native runtimes is maturing fast.",
    paragraphs: [
      "Client-side machine learning is having a hardware-assisted moment. Unified NPUs and efficient ARM SoCs mean on-device inference is viable for assistants, media features, and light document understanding without melting battery life or forcing every request to the cloud.",
      "Application teams are designing with quantization and model size budgets from day one. Smaller architectures, distillation, and ONNX-based pipelines are standard where offline or low-latency behavior is a product requirement, not an afterthought.",
      "Privacy and compliance benefits follow naturally: sensitive text and media can stay on device with optional cloud sync only for explicitly user-approved actions. That narrative resonates with both enterprise buyers and consumer segments wary of data exhaust.",
      "The ecosystem still varies by OS and chip generation, so cross-platform products invest in abstraction layers and graceful degradation—features that work well on the latest silicon and still function, albeit slower, elsewhere.",
    ],
  },
  {
    slug: "rust-tooling-monorepos",
    title: "Rust in the monorepo: shared libraries without slowing CI",
    dek: "Incremental builds and remote cache hits are the new baseline expectation.",
    category: "DevTools",
    datePublished: "2025-03-01",
    readingTimeMinutes: 6,
    excerpt:
      "Teams adopting Rust for core services are investing in cache-friendly workspaces and cross-language bindings so mobile and web clients stay in sync with one toolchain.",
    paragraphs: [
      "Rust’s adoption in backend and systems layers often starts with a single service, then spreads when teams prove they can share libraries across the monorepo without CI times ballooning. Remote caching, incremental compilation, and workspace splitting are now table stakes for those programs.",
      "Platform engineers focus on deterministic builds and reproducible artifacts so caches stay hot across branches. That discipline pays off when Rust code sits beside TypeScript, Swift, or Kotlin clients that consume generated bindings or shared schemas.",
      "Cross-language boundaries are explicit: FFI surfaces are thin, well-tested, and versioned so mobile releases are not blocked by server refactors. Documentation and codegen pipelines receive the same scrutiny as application features.",
      "The payoff is a single source of truth for performance-critical logic—fewer subtle divergences between what the server enforces and what clients assume—without sacrificing the productivity expectations of a modern monorepo.",
    ],
  },
  {
    slug: "series-b-efficiency-metrics",
    title: "Series B boards ask for efficiency metrics alongside growth",
    dek: "Burn multiples and gross margin by segment are back in every monthly deck.",
    category: "Startups",
    datePublished: "2025-02-26",
    readingTimeMinutes: 5,
    excerpt:
      "Founders are aligning hiring plans with concrete revenue per engineer targets. The narrative shift from growth-at-all-costs is visible in how roadmaps are communicated.",
    paragraphs: [
      "Venture-backed software companies at Series B and beyond are facing boards that want growth and capital efficiency in the same sentence. Metrics that were once annual footnotes—burn multiple, gross margin by segment, net revenue retention explained with cost to serve—are now front-page in monthly updates.",
      "Founders respond by tying hiring to concrete revenue or pipeline milestones rather than roadmap optimism alone. Engineering and G&A headcount plans include scenario analysis: what happens to runway if expansion slows for two quarters.",
      "Product roadmaps increasingly highlight margin impact: infrastructure spend per customer, support load driven by specific features, and pricing experiments tied to packaging. The goal is to show that product decisions and financial outcomes are linked, not guessed after the fact.",
      "The cultural shift favors transparency inside the company as well. When teams understand how their work affects margin and runway, prioritization debates become less ideological and more data-grounded—which is what investors mean when they ask for operational maturity.",
    ],
  },
];

export function getTechNewsBySlug(slug: string): TechNewsItem | undefined {
  return techNewsDemoItems.find((item) => item.slug === slug);
}

export function getAllTechNewsSlugs(): string[] {
  return techNewsDemoItems.map((item) => item.slug);
}
