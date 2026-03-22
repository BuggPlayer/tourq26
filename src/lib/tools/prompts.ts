import type {
  BudgetFields,
  FounderOnePagerFields,
  JobPostFields,
  OnePagerFields,
  ParsedToolFields,
  RfpFields,
  TechStackFields,
  VendorFields,
} from "./schemas";
import type { LiveToolId } from "./schemas";

export const SYSTEM =
  "You are a concise, practical advisor for founders, engineering leaders, and hiring managers at software companies. " +
  "Use clear headings and bullet points. Do not invent binding dollar amounts, legal facts, or metrics the user did not provide. " +
  "No fluff or clichés. You are not a lawyer, accountant, architect-of-record, or formal estimator.";

function timelineLabel(t: BudgetFields["timeline"]): string {
  const map: Record<BudgetFields["timeline"], string> = {
    lt3m: "Under 3 months",
    "3to6m": "3–6 months",
    "6to12m": "6–12 months",
    gt12m: "12+ months",
  };
  return map[t];
}

function teamLabel(m: BudgetFields["teamModel"]): string {
  const map: Record<BudgetFields["teamModel"], string> = {
    in_house: "Mostly in-house",
    agency: "External agency / studio",
    hybrid: "Hybrid (in-house + partner)",
  };
  return map[m];
}

function complexityLabel(c: BudgetFields["complexity"]): string {
  const map: Record<BudgetFields["complexity"], string> = {
    low: "Low (MVP, few integrations)",
    medium: "Medium (multiple features, some integrations)",
    high: "High (many features, compliance, real-time, or novel tech)",
  };
  return map[c];
}

const bandLabels: Record<VendorFields["budgetBand"], string> = {
  under25k: "Under ~$25k",
  "25to100k": "~$25k–$100k",
  "100to250k": "~$100k–$250k",
  "250kplus": "$250k+",
};

function rfpTimelineLabel(t: RfpFields["timeline"]): string {
  if (t === "flexible") return "Flexible / TBD";
  return timelineLabel(t);
}

function techStageLabel(s: TechStackFields["stage"]): string {
  const m: Record<TechStackFields["stage"], string> = {
    idea: "Pre-product / idea",
    mvp: "MVP / early product",
    growth: "Growth",
    scale: "Scale",
  };
  return m[s];
}

function engSizeLabel(s: TechStackFields["engTeamSize"]): string {
  const m: Record<TechStackFields["engTeamSize"], string> = {
    solo: "Solo / founder-engineer",
    small_2_5: "2–5 engineers",
    medium_6_20: "6–20 engineers",
    large_20plus: "20+ engineers",
  };
  return m[s];
}

function loadLabel(l: TechStackFields["loadBand"]): string {
  const m: Record<TechStackFields["loadBand"], string> = {
    unknown: "Unknown",
    low: "Low steady load",
    medium: "Medium",
    high: "High",
    spiky: "Spiky / event-driven",
  };
  return m[l];
}

function spendLabel(s: TechStackFields["spendPosture"]): string {
  const m: Record<TechStackFields["spendPosture"], string> = {
    minimize_ops_cost: "Minimize ops spend",
    balanced: "Balanced cost vs velocity",
    prioritize_velocity: "Prioritize speed / managed services OK",
  };
  return m[s];
}

function fundingLabel(f: FounderOnePagerFields["fundingStage"]): string {
  const m: Record<FounderOnePagerFields["fundingStage"], string> = {
    bootstrapped: "Bootstrapped",
    pre_seed: "Pre-seed",
    seed: "Seed",
    series_a: "Series A",
    later: "Later stage",
    undisclosed: "Undisclosed",
  };
  return m[f];
}

function seniorityJob(s: JobPostFields["seniority"]): string {
  const m: Record<JobPostFields["seniority"], string> = {
    junior: "Junior",
    mid: "Mid-level",
    senior: "Senior",
    lead: "Lead",
    principal: "Principal / Staff",
  };
  return m[s];
}

function employmentLabel(e: JobPostFields["employmentType"]): string {
  const m: Record<JobPostFields["employmentType"], string> = {
    full_time: "Full-time",
    contract: "Contract",
    contract_to_hire: "Contract-to-hire",
  };
  return m[e];
}

function workStyleLabel(w: JobPostFields["workStyle"]): string {
  const m: Record<JobPostFields["workStyle"], string> = {
    remote: "Remote",
    hybrid: "Hybrid",
    onsite: "On-site",
    flexible: "Flexible",
  };
  return m[w];
}

export function buildUserPrompt(toolId: LiveToolId, data: ParsedToolFields): string {
  if (toolId === "interview-prep") {
    throw new Error("interview-prep uses structured generation; do not call buildUserPrompt");
  }
  if (toolId === "app-budget-estimator") {
    const d = data as BudgetFields;
    return `Produce a software / app budget estimate as follows.

Context:
- Platforms & product type: ${d.platforms}
- Complexity: ${complexityLabel(d.complexity)}
- Desired timeline: ${timelineLabel(d.timeline)}
- Team model: ${teamLabel(d.teamModel)}

Output structure:
1) **Executive summary** (2–3 sentences): what kind of build this implies.
2) **Indicative budget range** — give a LOW–HIGH range in USD (or say "order of magnitude" if too uncertain) and state clearly this is NOT a quote.
3) **What drives cost** — bullet list (scope, integrations, design, QA, compliance, etc.).
4) **Ways to reduce cost or risk** — practical bullets.
5) **When to get a firm quote** — short paragraph.

Keep the total response under 900 words.`;
  }

  if (toolId === "vendor-evaluation") {
    const d = data as VendorFields;
    const compliance = d.compliance.trim() || "None specified";
    return `Help evaluate software development vendors / partners.

Context:
- Stack / tech: ${d.stack}
- Region / timezone preference: ${d.region}
- Budget band (indicative): ${bandLabels[d.budgetBand]}
- Compliance / security notes: ${compliance}

Output structure:
1) **Fit criteria checklist** — table or bullets: criterion, why it matters, what good looks like.
2) **Red flags** — short list specific to this context.
3) **Discovery call questions** — 12–15 concrete questions to ask vendors.
4) **Suggested next step** — how to run a short shortlist (e.g. paid discovery, pilot).

Keep under 900 words.`;
  }

  if (toolId === "one-pager-pitch") {
    const d = data as OnePagerFields;
    return `Draft a founder one-pager / narrative pitch the user can edit.

Inputs:
- Problem: ${d.problem}
- Audience / who it's for: ${d.audience}
- Solution / product: ${d.solution}
- Traction (optional): ${d.traction.trim() || "Not provided"}
- Ask (optional): ${d.ask.trim() || "Not provided"}

Output:
1) **Title line** — one sharp line (not a buzzword salad).
2) **The story** — 5–8 short paragraphs: problem → insight → solution → why now → traction → ask.
3) **Optional email version** — 5–7 bullet points they can paste into an intro email.

Tone: credible, specific, investor- and partner-friendly. No fake metrics. Under 800 words.`;
  }

  if (toolId === "rfp-drafter") {
    const d = data as RfpFields;
    return `Draft a software RFP / project brief the buyer can edit and send to vendors.

Organization: ${d.orgName}
Project title: ${d.projectTitle}
Executive summary: ${d.summary}
Business objectives: ${d.objectives}
Scope & deliverables (as stated): ${d.scope}
Desired timeline: ${rfpTimelineLabel(d.timeline)}
Indicative budget band: ${bandLabels[d.budgetBand]}
Technical / platform requirements: ${d.techNeeds}
Constraints (optional): ${d.constraints.trim() || "None"}
Evaluation preferences (optional): ${d.evaluationNotes.trim() || "None"}

Output sections (use markdown headings):
1) **Invitation to respond** — tone: professional, inclusive.
2) **Background & objectives**
3) **Scope of work** — bullet milestones; flag open questions.
4) **Technical & quality expectations** — testing, security, SLAs as appropriate.
5) **Commercial & engagement model** — ask for pricing structure options without demanding fake precision.
6) **Proposal format & timeline** — what to submit, by when.
7) **Evaluation criteria** — weighted bullets.
8) **Assumptions & exclusions** — short list.

Do not invent compliance certifications the org does not have. Under 1100 words.`;
  }

  if (toolId === "tech-stack-roi") {
    const d = data as TechStackFields;
    return `Help a startup choose and reason about **tech stack trade-offs** (scalability, ops burden, time-to-market). This is NOT financial ROI — no fabricated dollar ROI.

Context:
- Stage: ${techStageLabel(d.stage)}
- Engineering team size: ${engSizeLabel(d.engTeamSize)}
- Traffic / load profile: ${loadLabel(d.loadBand)}
- Spend posture: ${spendLabel(d.spendPosture)}
- Compliance / data residency notes: ${d.compliance.trim() || "None"}
- Other notes: ${d.notes.trim() || "None"}

Output:
1) **Assumptions** — bullet list (what you are inferring).
2) **Architecture posture** — monolith vs modular monolith vs services: when each fits *this* context; pick a sensible default and say why.
3) **Stack dimensions** — short bullets for: app layer, API, data stores, async/jobs, hosting, observability, CI/CD — suggest patterns, not brand wars unless clearly justified.
4) **Risk register** — top 5 risks (technical debt, vendor lock-in, hiring, cost surprises) with mitigations.
5) **When to revisit** — triggers (team size, traffic, compliance events).
6) **Disclaimer** — one sentence: not a substitute for a solutions architect.

Under 950 words. Be opinionated but humble.`;
  }

  if (toolId === "founder-one-pager") {
    const d = data as FounderOnePagerFields;
    return `Create an **investor-ready founder one-pager** (intro sheet) the user can paste into a doc or PDF. Not a full pitch deck.

Founder: ${d.fullName}, ${d.roleTitle}
Company: ${d.companyName} — ${d.companyOneLiner}
Problem: ${d.problem}
Solution / product: ${d.solution}
Traction: ${d.traction.trim() || "Not provided"}
Team: ${d.teamNote.trim() || "Not provided"}
Funding stage: ${fundingLabel(d.fundingStage)}
Ask: ${d.ask.trim() || "Not specified"}

Output (use clear section headers):
1) **Header** — name, role, company, one-liner, contact placeholders [email] [link]
2) **Problem**
3) **Solution**
4) **Why now / market** — short; do not invent market sizes unless user implied.
5) **Traction** — only use user facts; if thin, say what evidence to add.
6) **Team** — frame credibly from user input only.
7) **The ask** — funding, intros, or hiring as given.
8) **Fine print** — one line: draft only, verify all numbers.

Under 750 words. Professional tone.`;
  }

  if (toolId === "job-post-generator") {
    const d = data as JobPostFields;
    return `Write a compelling **engineering job post** to edit and publish.

Title: ${d.roleTitle}
Company one-liner: ${d.companyOneLiner}
Seniority: ${seniorityJob(d.seniority)}
Employment: ${employmentLabel(d.employmentType)}
Work style: ${workStyleLabel(d.workStyle)}
Stack / tech: ${d.stack}
About & mission: ${d.aboutMission}
Responsibilities (from hiring manager): ${d.responsibilities}
Must-have requirements: ${d.requirements.trim() || "Infer from above"}
Benefits / perks: ${d.benefits.trim() || "Not specified — suggest generic inclusive line"}

Output:
1) **Job title line** (SEO-friendly but not spammy)
2) **Opening hook** — 2–3 sentences
3) **What you'll do** — bullets (8–12)
4) **What we're looking for** — must-haves vs nice-to-haves
5) **Tech environment** — short paragraph
6) **Benefits** — bullets (use provided or sensible defaults)
7) **How to apply** — short CTA
8) **EEO / diversity** — one inclusive sentence (generic, not legal advice)

Avoid biased language where possible. Under 850 words.`;
  }

  return "Unsupported tool.";
}
