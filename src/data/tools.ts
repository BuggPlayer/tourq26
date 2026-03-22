export type ToolAudience = "founder" | "engineer" | "hiring";

export type ToolStatus = "live" | "coming_soon";

export type ToolEntry = {
  slug: string;
  title: string;
  description: string;
  audiences: ToolAudience[];
  status: ToolStatus;
};

export const tools: ToolEntry[] = [
  {
    slug: "app-budget-estimator",
    title: "App & software budget estimator",
    description:
      "Rough cost ranges for mobile, web, or custom software — with clear assumptions. Not a quote.",
    audiences: ["founder"],
    status: "live",
  },
  {
    slug: "vendor-evaluation",
    title: "Vendor & partner evaluation",
    description:
      "Turn your context into a criteria checklist and discovery-call questions — extends our partner checklist mindset.",
    audiences: ["founder", "hiring"],
    status: "live",
  },
  {
    slug: "one-pager-pitch",
    title: "One-pager pitch",
    description:
      "Draft a tight narrative: problem, audience, solution, traction, and ask — ready to edit and share.",
    audiences: ["founder"],
    status: "live",
  },
  {
    slug: "rfp-drafter",
    title: "Software RFP & project brief drafter",
    description:
      "Structured sections for an RFP or brief you can send to vendors — invitation, scope, commercial, evaluation.",
    audiences: ["founder"],
    status: "live",
  },
  {
    slug: "tech-stack-roi",
    title: "Tech stack ROI & scalability",
    description:
      "Trade-offs for your stage: architecture posture, ops burden, risks — educational, not dollar ROI or formal architecture sign-off.",
    audiences: ["founder", "engineer"],
    status: "live",
  },
  {
    slug: "interview-prep",
    title: "Interview prep",
    description:
      "Multi-track prep: frontend, backend, system design, DevOps, mobile, data/ML, security — with industry bar, Q&A cards, copy/share, and local self-ratings.",
    audiences: ["engineer", "hiring"],
    status: "live",
  },
  {
    slug: "founder-one-pager",
    title: "Founder resume & investor one-pager",
    description:
      "Investor-ready one-page intro: problem, solution, traction, team, ask — for intros and angels.",
    audiences: ["founder"],
    status: "live",
  },
  {
    slug: "job-post-generator",
    title: "Engineering job post generator",
    description:
      "Role-focused job posts: responsibilities, bar, benefits, and inclusive language you can edit.",
    audiences: ["hiring"],
    status: "live",
  },
];

export function getToolBySlug(slug: string): ToolEntry | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getLiveTools(): ToolEntry[] {
  return tools.filter((t) => t.status === "live");
}
