/** Extra crawlable paragraphs appended on freebie detail pages (word count + context). */

const COMMON = [
  "You can duplicate sections into Notion, Confluence, or Google Docs, or keep a printed copy in your war room. Update the document as your product evolves—version control is yours; we do not track downloads.",
  "When you outgrow static checklists and need engineering capacity—mobile releases, web platforms, APIs, or AI workflows with proper logging—Torq Studio provides senior-led delivery and advisory. We scope honestly and document handover so your team can maintain what we build.",
];

const BY_SLUG: Record<string, string[]> = {
  "app-pre-launch-checklist": [
    "Pre-launch is where small omissions become store rejections or bad first impressions: missing privacy disclosures, broken deep links, weak crash visibility, or analytics that do not match your compliance story. Work through this list with engineering, design, and legal in the same room.",
    "Treat store review as a process, not a single submission. Build time for rejection feedback, screenshot updates, and dependency upgrades triggered by policy changes. Keep a rollback or feature-flag plan if you launch risky features behind toggles.",
  ],
  "mobile-app-partner-checklist": [
    "Scoring vendors consistently avoids gut-feel decisions. Weight criteria that matter for your risk profile: security practices, release cadence, code ownership, documentation, and how they handle scope change. Ask for references in your industry or regulatory context.",
    "A strong partner explains trade-offs in writing, proposes phased milestones, and does not promise fixed dates before understanding constraints. Use this checklist to compare answers side by side instead of relying on slide decks alone.",
  ],
  "project-brief-template": [
    "A good brief aligns product, engineering, and finance on what success means. Include users, non-goals, integrations, environments, and acceptance tests where possible. Vague briefs produce vague estimates; specificity reduces change-order friction later.",
    "Share the brief with internal stakeholders before you send it externally. Contradictions discovered early are cheap; contradictions discovered in sprint three are expensive. Attach links to designs, APIs, or legacy systems rather than pasting everything inline.",
  ],
  "build-vs-buy-vs-partner-guide": [
    "Build when the capability is strategic, differentiated, or you already have strong in-house skills. Buy when a mature product fits your process and total cost of ownership is clear. Partner when you need speed and senior execution without a permanent hire cycle.",
    "Hybrid approaches are common: buy a core platform, partner for integrations and custom workflows, and keep a thin internal team for roadmap ownership. Revisit the decision as your scale and compliance requirements change.",
  ],
};

export function getFreebieExtraProseParagraphs(slug: string): string[] {
  const specific = BY_SLUG[slug];
  if (!specific?.length) return COMMON;
  return [...specific, ...COMMON];
}
