import type { InterviewFields, InterviewTrackId } from "./schemas";

export const INTERVIEW_SYSTEM =
  "You produce structured interview prep content for software engineers. " +
  "Be accurate, level-appropriate, and inclusive. Do not suggest illegal or discriminatory interview topics (e.g. age, family status, religion). " +
  "Answers should be concise reference explanations, not memorized scripts. " +
  "Output must strictly match the requested JSON schema fields.";

const TRACK_LABELS: Record<InterviewTrackId, string> = {
  frontend: "Frontend (web UI, browser, accessibility, performance)",
  backend: "Backend (APIs, services, data, concurrency)",
  system_design: "System design (scalability, reliability, trade-offs)",
  devops: "DevOps / platform (CI/CD, infra, observability, containers)",
  mobile: "Mobile (iOS/Android, native vs cross-platform)",
  data_ml: "Data / ML pipelines, analytics, model serving basics",
  security: "Security (authn/z, OWASP basics, secrets, threat thinking)",
};

const INDUSTRY_LABELS: Record<InterviewFields["industryBar"], string> = {
  general: "General industry mix — balanced depth",
  startup: "Startup-style — pragmatic trade-offs, velocity, ownership, thin specs",
  big_tech: "Big-tech bar — rigor, scalability, edge cases, measurable complexity",
  enterprise: "Enterprise — compliance touchpoints, integration, long-lived systems",
};

const LEVEL_LABELS: Record<InterviewFields["level"], string> = {
  junior: "Junior — fundamentals, guided problem-solving, learning appetite",
  mid: "Mid — independent delivery, solid patterns, debugging",
  senior: "Senior — system thinking, mentoring, ambiguous scope",
  lead: "Lead — technical direction, stakeholder alignment, risk",
  staff: "Staff+ — cross-team impact, architecture, org-level trade-offs",
};

function tracksList(tracks: InterviewTrackId[]): string {
  return tracks.map((t) => `- ${t}: ${TRACK_LABELS[t]}`).join("\n");
}

export function buildInterviewObjectUserPrompt(d: InterviewFields): string {
  const tracks = d.tracks;
  const fw = d.frameworkFocus.trim();
  const reactNote =
    tracks.includes("frontend") && /react/i.test(fw)
      ? "\n\nFor the **frontend** track: include at least 3 questions that are explicitly **React-specific** (e.g. hooks rules, reconciliation, keys, concurrent features at a high level, performance patterns, state vs props). Each must have a substantive reference answer."
      : tracks.includes("frontend") && fw
        ? `\n\nFor **frontend**, bias questions toward: ${fw} where relevant.`
        : "";

  const industry = INDUSTRY_LABELS[d.industryBar];
  const level = LEVEL_LABELS[d.level];
  const ctx = d.context.trim() || "None";

  if (d.mode === "candidate") {
    return `Generate **candidate** interview prep as JSON.

Role title: ${d.roleTitle}
Level: ${level}
Industry calibration: ${industry}
Selected tracks (produce EXACTLY one section per track, in this order; track id must match exactly):
${tracksList(tracks)}
Framework / stack focus (optional): ${fw || "None"}
Extra context: ${ctx}
${reactNote}

Rules:
- Each section: \`track\` must be one of: ${tracks.join(", ")}.
- Per section: 3–6 items. Each item: \`question\`, \`answer\` (solid reference, 2–6 short paragraphs max), \`difficulty\` easy|medium|hard, optional \`tags\` (1–4 strings).
- Mix behavioral and technical within each track as appropriate; align difficulty spread with level (${d.level}).
- \`intro\`: 2–4 short paragraphs summarizing how to use this prep.
- \`studyPlan\`: optional array of 5–12 strings (1–2 week study steps).

Do not include tracks the user did not select. Do not duplicate the same question across sections.`;
  }

  return `Generate **hiring manager** interview content as JSON.

Role hiring for: ${d.roleTitle}
Level bar: ${level}
Industry calibration: ${industry}
Tracks for question banks (one section per track, same order; track id must match exactly):
${tracksList(tracks)}
Framework / stack focus (optional): ${fw || "None"}
Company context: ${ctx}
${reactNote}

Rules:
- \`scorecard\`: 4–8 rows: competency + what good looks like (aligned to role and tracks).
- \`rounds\`: 2–5 interview rounds with name, focus, durationHint.
- \`sections\`: each selected track, 4–8 items. Each item: \`question\`, \`rubricHints\` (what to listen for, follow-ups, pass/fail signals), \`difficulty\`.
- \`inclusiveTips\`: optional 3–6 strings.
- \`redFlags\`: optional 4–8 strings.

Do not include tracks the user did not select. Questions must be lawful and job-related.`;
}
