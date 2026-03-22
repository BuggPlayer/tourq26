import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const blogPath = join(__dirname, "..", "content", "blog.json");

const newPosts = [
  {
    slug: "mvp-vs-full-product-when-to-ship",
    title: "MVP vs Full Product: When Should You Ship?",
    description:
      "A framework for founders and PMs: scope, risk, learning velocity, and how to avoid shipping too little—or polishing too long.",
    date: "2025-03-14",
    readTime: "9 min read",
    authorName: "Torq Studio",
    body: `<p>The hardest product decision is often not <em>what</em> to build but <em>how much</em> before you show users. Ship too early and you damage trust; ship too late and you burn cash without learning. Here is a practical framework we use with clients across mobile, web, and B2B SaaS.</p>
<h2>Define the job of your release</h2>
<p>Every release should have one primary job: validate demand, test pricing, prove a technical risk, or win a lighthouse customer. If your MVP tries to do all four, it is not an MVP—it is a compressed roadmap. Write the job in one sentence and cut features that do not serve it.</p>
<h2>Vertical slice beats horizontal layers</h2>
<p>Teams often build “all auth” then “all API” then “all UI.” A better pattern is a <strong>thin vertical slice</strong>: one user, one core flow, end to end. That surfaces integration issues early and gives demos that feel real—even if the admin panel is ugly.</p>
<h2>Quality bar: what cannot be fake</h2>
<p>Not everything can be rough. Security basics, data loss risks, and anything that touches money or compliance need real rigour. Cosmetic polish and edge-case UX can lag if your learning goal does not depend on them. Be explicit with stakeholders about that split.</p>
<h2>Signals you are ready to widen scope</h2>
<ul><li>Repeatable activation: users complete the core flow without hand-holding.</li><li>Instrumentation answers your riskiest question (conversion, retention, latency).</li><li>Support load is understood—you know what breaks and how often.</li></ul>
<h2>When a “big bang” launch still makes sense</h2>
<p>Regulated launches, hardware pairings, or replace-in-place enterprise rollouts sometimes require a fuller cut. Even then, phase internal pilots and design partners before marketing spend. The goal is the same: controlled learning.</p>
<p>At Torq Studio we run discovery workshops that end in a scoped milestone plan—not a vague backlog. If you are debating MVP scope, a short consultation often pays for itself in avoided rework.</p>`,
  },
  {
    slug: "rfp-custom-software-how-to-write-one",
    title: "How to Write an RFP for Custom Software (That Gets Useful Proposals)",
    description:
      "Procurement and engineering leaders: what to include in an RFP so vendors respond with comparable, realistic bids—and fewer surprises later.",
    date: "2025-03-12",
    readTime: "10 min read",
    authorName: "Torq Studio",
    body: `<p>A weak RFP attracts generic proposals or wildly divergent numbers. A strong one aligns internal stakeholders, sets evaluation criteria, and lets good vendors differentiate honestly. This guide is for teams buying bespoke mobile, web, or platform work.</p>
<h2>Start with outcomes, not feature lists</h2>
<p>List the business outcomes and constraints: users, regions, integrations, compliance, uptime, and launch window. A bullet list of screens is useful as an appendix, not a substitute for goals. Great vendors will propose the right features once they understand the job.</p>
<h2>Technical context vendors actually need</h2>
<p>Share your current stack, APIs, identity model, hosting preferences, and any non-negotiables (e.g. on-prem, specific cloud). Redact secrets, but do not hide architecture—unknowns become padding in estimates.</p>
<h2>Ask for how they will deliver, not just price</h2>
<p>Request methodology: discovery length, sprint cadence, testing approach, definition of done, and how change is handled. Ask for references comparable in size and risk. Price without process is not comparable.</p>
<h2>Evaluation matrix</h2>
<p>Weight criteria up front: fit, velocity risk, security posture, support model, IP terms. Score blindly where possible to reduce bias. Leave room for a short paid discovery if scope is genuinely unclear—fixed bids on fuzzy specs hurt both sides.</p>
<h2>Appendix checklist</h2>
<ul><li>Success metrics and acceptance tests (even draft).</li><li>Data flows and third-party systems.</li><li>Roles on your side (product owner, technical approver).</li><li>Commercial model preference (fixed phases vs retainer).</li></ul>
<p>We respond to well-structured RFPs with phased proposals. If you are drafting one, we are happy to review it before you go to market.</p>`,
  },
  {
    slug: "technical-debt-refactor-rewrite-or-strangle",
    title: "Technical Debt: Refactor, Rewrite, or Strangle?",
    description:
      "For engineering leaders: decision criteria, risk profiles, and how to sequence modernisation without stalling the roadmap.",
    date: "2025-03-08",
    readTime: "11 min read",
    authorName: "Torq Studio",
    body: `<p>Every growing product accumulates debt. The question is not whether to address it but <em>when</em> and <em>how aggressively</em>. Here is how we advise CTOs and heads of engineering.</p>
<h2>Classify debt by symptom</h2>
<p><strong>Velocity debt</strong> slows every feature. <strong>Reliability debt</strong> causes incidents. <strong>Security debt</strong> raises audit risk. <strong>Hiring debt</strong> makes staffing painful. The highest category tied to your next 12-month goals usually goes first.</p>
<h2>Refactor when boundaries are clear</h2>
<p>Targeted refactors work when modules have seams: extract services, add tests around hotspots, introduce interfaces. Pair with feature work so the business sees continuous value—not a “stop the world” quarter.</p>
<h2>Rewrite when the cost of change exceeds rebuild</h2>
<p>Consider rewrite when the stack is end-of-life, domain model was wrong from day one, or operational cost (incidents + support) dwarfs feature investment. Mitigate with strangler patterns: route new flows through new services while legacy handles the tail.</p>
<h2>Measure before you pitch the board</h2>
<p>Bring data: lead time, change failure rate, MTTR, cost per deploy, and engineer survey themes. Narrative without metrics rarely wins capex.</p>
<h2>Partnering for modernisation</h2>
<p>External teams can accelerate refactors if they adopt your standards and ship in thin slices. Avoid “big bang” handovers—embed with your staff engineers and document decisions.</p>
<p>Torq Studio routinely joins mid-flight products for stabilisation and targeted rebuilds. If you want a second opinion on roadmap vs rewrite, reach out for a technical assessment sprint.</p>`,
  },
  {
    slug: "outsourcing-software-security-ip-checklist",
    title: "Outsourcing Software Development: Security & IP Checklist",
    description:
      "Before you sign: access control, code ownership, data handling, and audit artefacts your security team and legal counsel will ask for.",
    date: "2025-03-06",
    readTime: "8 min read",
    authorName: "Torq Studio",
    body: `<p>Outsourcing can accelerate delivery, but weak contracting creates security and IP gaps that show up in due diligence—or worse, in a breach. Use this checklist with your vendor.</p>
<h2>Access and identity</h2>
<ul><li>Least-privilege accounts; no shared root credentials.</li><li>SSO/MFA into your org where possible; time-bounded access reviews.</li><li>Separate production vs staging; break-glass procedures documented.</li></ul>
<h2>Code and IP</h2>
<p>Confirm deliverables include source, build instructions, and dependency manifests. IP assignment should cover work product and customisations, with carve-outs only for pre-existing vendor libraries clearly listed. Escrow can be sensible for regulated buyers.</p>
<h2>Data protection</h2>
<p>Define what PII or secrets the vendor may process, retention limits, subprocessors, and breach notification timelines. Align with your DPA and regional rules (GDPR, etc.).</p>
<h2>Engineering hygiene</h2>
<p>Expect secure SDLC basics: dependency scanning, code review, secrets scanning, and environment separation. Ask for sample security test reports or pentest summaries from similar engagements.</p>
<h2>Exit plan</h2>
<p>Document handover: repos, CI/CD, runbooks, and support windows. No vendor should be a single point of persistence for knowledge.</p>
<p>We align to client security policies from day zero. If your procurement template needs a technical annex, we can provide one during evaluation.</p>`,
  },
  {
    slug: "software-estimation-fixed-price-vs-phased",
    title: "Software Estimation: Why Fixed Bids Break—and What Works",
    description:
      "For buyers and delivery leads: how to structure commercials when requirements are fuzzy, and how to keep trust when estimates change.",
    date: "2025-03-04",
    readTime: "9 min read",
    authorName: "Torq Studio",
    body: `<p>Fixed-price contracts feel safe. They often hide risk premiums, encourage corner-cutting, or collapse when discovery surfaces reality. Here is a healthier pattern we use with product organisations.</p>
<h2>The cone of uncertainty</h2>
<p>Early estimates are inherently wide. Pretending otherwise forces vendors to pad silently or fight change orders later. Acknowledge uncertainty and plan in phases.</p>
<h2>Phase zero: paid discovery</h2>
<p>A short, bounded discovery produces architecture notes, backlog slices, risks, and a phased estimate. You pay for clarity—not a guess. Outputs should be yours to shop or take in-house.</p>
<h2>Milestone pricing for known slices</h2>
<p>Once scope is defined for a slice (e.g. MVP storefront), fixed milestones are fair. Tie payments to acceptance tests you agree up front.</p>
<h2>Retainers for product iteration</h2>
<p>After launch, roadmaps evolve weekly. Monthly capacity with a rolling priority list matches reality better than endless change orders.</p>
<h2>Transparency when things shift</h2>
<p>Good partners explain <em>why</em> estimates move: new integrations, compliance findings, or scope creep. Ask for impact analysis before approving additions.</p>
<p>Torq Studio publishes milestone plans after discovery and tracks burn vs forecast in steering meetings. If your next procurement cycle needs a commercial model review, we are happy to advise.</p>`,
  },
];

const existing = JSON.parse(readFileSync(blogPath, "utf8"));
const merged = [...newPosts, ...existing];
writeFileSync(blogPath, JSON.stringify(merged, null, 2) + "\n");
console.log("Wrote", merged.length, "posts to content/blog.json");
