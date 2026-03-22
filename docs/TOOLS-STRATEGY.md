# Torq Studio — `/tools` strategy & spec

## Goal

SEO-first, qualified traffic. Each tool URL pairs **human-written methodology + FAQs** with AI-assisted output (`src/data/tool-editorial.ts`).

## Live tools (registry: `src/data/tools.ts`)

| Slug | Purpose |
|------|---------|
| `app-budget-estimator` | Indicative budget **ranges** — not a quote |
| `vendor-evaluation` | Partner checklist + discovery questions |
| `one-pager-pitch` | Founder narrative draft |
| `rfp-drafter` | RFP / project brief sections |
| `tech-stack-roi` | Stack trade-offs & risks (no fake dollar ROI) |
| `interview-prep` | **Tracks** (1–4): frontend, backend, system design, DevOps, mobile, data/ML, security; **industry bar**; candidate **Q&A cards** or hiring **scorecard + rubrics**; `generateObject` + structured JSON response |
| `founder-one-pager` | Investor intro one-pager |
| `job-post-generator` | Engineering job post draft |

## Technical

- **API:** `POST /api/tools/run` — [`src/app/api/tools/run/route.ts`](src/app/api/tools/run/route.ts)
- **`interview-prep` only:** `generateObject` with schemas in [`src/lib/tools/interview-output.ts`](src/lib/tools/interview-output.ts); prompts in [`src/lib/tools/interview-prompts.ts`](src/lib/tools/interview-prompts.ts); response `{ format: "structured", mode, data }`.
- **Other tools:** `generateText` + `{ text }`; prompts in [`src/lib/tools/prompts.ts`](src/lib/tools/prompts.ts).
- **Input schemas:** [`src/lib/tools/schemas.ts`](src/lib/tools/schemas.ts).
- **Interview UI:** [`src/components/tools/InterviewPrepRunner.tsx`](src/components/tools/InterviewPrepRunner.tsx) (copy, share, localStorage ratings).
- **Rate limit:** [`src/lib/tools-rate-limit.ts`](src/lib/tools-rate-limit.ts) (KV optional; **20 / IP / day** when configured).
- **Env:** `OPENAI_API_KEY` (required for generation).

## Content ops

- Pillar posts linking to each tool; internal links between related tools (e.g. job post ↔ interview prep, RFP ↔ blog).

## Legal

- Privacy: `/privacy` — Free AI tools section.
- On-page: drafts only; not legal, financial, investment, or architecture sign-off.
