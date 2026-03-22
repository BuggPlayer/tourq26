import { z } from "zod";

export const LIVE_TOOL_IDS = [
  "app-budget-estimator",
  "vendor-evaluation",
  "one-pager-pitch",
  "rfp-drafter",
  "tech-stack-roi",
  "interview-prep",
  "founder-one-pager",
  "job-post-generator",
] as const;

export type LiveToolId = (typeof LIVE_TOOL_IDS)[number];

export const budgetFieldsSchema = z.object({
  platforms: z.string().trim().min(1).max(500),
  complexity: z.enum(["low", "medium", "high"]),
  timeline: z.enum(["lt3m", "3to6m", "6to12m", "gt12m"]),
  teamModel: z.enum(["in_house", "agency", "hybrid"]),
});

export const vendorFieldsSchema = z.object({
  stack: z.string().trim().min(1).max(400),
  region: z.string().trim().min(1).max(200),
  budgetBand: z.enum(["under25k", "25to100k", "100to250k", "250kplus"]),
  compliance: z.string().trim().max(500).optional().default(""),
});

export const onePagerFieldsSchema = z.object({
  problem: z.string().trim().min(10).max(2000),
  audience: z.string().trim().min(5).max(1500),
  solution: z.string().trim().min(10).max(2000),
  traction: z.string().trim().max(1500).optional().default(""),
  ask: z.string().trim().max(1500).optional().default(""),
});

export const rfpFieldsSchema = z.object({
  orgName: z.string().trim().min(1).max(200),
  projectTitle: z.string().trim().min(1).max(200),
  summary: z.string().trim().min(20).max(2500),
  objectives: z.string().trim().min(10).max(2000),
  scope: z.string().trim().min(10).max(3000),
  timeline: z.enum(["lt3m", "3to6m", "6to12m", "gt12m", "flexible"]),
  budgetBand: z.enum(["under25k", "25to100k", "100to250k", "250kplus"]),
  techNeeds: z.string().trim().min(5).max(1500),
  constraints: z.string().trim().max(1500).optional().default(""),
  evaluationNotes: z.string().trim().max(1200).optional().default(""),
});

export const techStackFieldsSchema = z.object({
  stage: z.enum(["idea", "mvp", "growth", "scale"]),
  engTeamSize: z.enum(["solo", "small_2_5", "medium_6_20", "large_20plus"]),
  loadBand: z.enum(["unknown", "low", "medium", "high", "spiky"]),
  spendPosture: z.enum(["minimize_ops_cost", "balanced", "prioritize_velocity"]),
  compliance: z.string().trim().max(600).optional().default(""),
  notes: z.string().trim().max(800).optional().default(""),
});

export const INTERVIEW_TRACK_IDS = [
  "frontend",
  "backend",
  "system_design",
  "devops",
  "mobile",
  "data_ml",
  "security",
] as const;

export type InterviewTrackId = (typeof INTERVIEW_TRACK_IDS)[number];

export const interviewFieldsSchema = z.object({
  mode: z.enum(["candidate", "hiring"]),
  roleTitle: z.string().trim().min(2).max(200),
  level: z.enum(["junior", "mid", "senior", "lead", "staff"]),
  tracks: z
    .array(z.enum(INTERVIEW_TRACK_IDS))
    .min(1)
    .max(4)
    .superRefine((arr, ctx) => {
      const u = new Set(arr);
      if (u.size !== arr.length) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Duplicate tracks" });
      }
    }),
  industryBar: z.enum(["general", "startup", "big_tech", "enterprise"]),
  frameworkFocus: z.string().trim().max(100).optional().default(""),
  context: z.string().trim().max(1200).optional().default(""),
});

export const founderOnePagerFieldsSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  roleTitle: z.string().trim().min(2).max(120),
  companyName: z.string().trim().min(1).max(120),
  companyOneLiner: z.string().trim().min(5).max(240),
  problem: z.string().trim().min(10).max(1800),
  solution: z.string().trim().min(10).max(1800),
  traction: z.string().trim().max(1200).optional().default(""),
  teamNote: z.string().trim().max(800).optional().default(""),
  fundingStage: z.enum([
    "bootstrapped",
    "pre_seed",
    "seed",
    "series_a",
    "later",
    "undisclosed",
  ]),
  ask: z.string().trim().max(800).optional().default(""),
});

export const jobPostFieldsSchema = z.object({
  roleTitle: z.string().trim().min(2).max(120),
  companyOneLiner: z.string().trim().min(5).max(400),
  seniority: z.enum(["junior", "mid", "senior", "lead", "principal"]),
  employmentType: z.enum(["full_time", "contract", "contract_to_hire"]),
  workStyle: z.enum(["remote", "hybrid", "onsite", "flexible"]),
  stack: z.string().trim().min(2).max(500),
  aboutMission: z.string().trim().min(10).max(2000),
  responsibilities: z.string().trim().min(20).max(3000),
  requirements: z.string().trim().max(2000).optional().default(""),
  benefits: z.string().trim().max(1200).optional().default(""),
});

export const runBodySchema = z.object({
  toolId: z.enum(LIVE_TOOL_IDS),
  fields: z.record(z.string(), z.unknown()),
});

export type BudgetFields = z.infer<typeof budgetFieldsSchema>;
export type VendorFields = z.infer<typeof vendorFieldsSchema>;
export type OnePagerFields = z.infer<typeof onePagerFieldsSchema>;
export type RfpFields = z.infer<typeof rfpFieldsSchema>;
export type TechStackFields = z.infer<typeof techStackFieldsSchema>;
export type InterviewFields = z.infer<typeof interviewFieldsSchema>;
export type FounderOnePagerFields = z.infer<typeof founderOnePagerFieldsSchema>;
export type JobPostFields = z.infer<typeof jobPostFieldsSchema>;

export type ParsedToolFields =
  | BudgetFields
  | VendorFields
  | OnePagerFields
  | RfpFields
  | TechStackFields
  | InterviewFields
  | FounderOnePagerFields
  | JobPostFields;

export function parseToolFields(
  toolId: LiveToolId,
  fields: Record<string, unknown>
): { ok: true; data: ParsedToolFields } | { ok: false; error: string } {
  try {
    switch (toolId) {
      case "app-budget-estimator":
        return { ok: true, data: budgetFieldsSchema.parse(fields) };
      case "vendor-evaluation":
        return { ok: true, data: vendorFieldsSchema.parse(fields) };
      case "one-pager-pitch":
        return { ok: true, data: onePagerFieldsSchema.parse(fields) };
      case "rfp-drafter":
        return { ok: true, data: rfpFieldsSchema.parse(fields) };
      case "tech-stack-roi":
        return { ok: true, data: techStackFieldsSchema.parse(fields) };
      case "interview-prep":
        return { ok: true, data: interviewFieldsSchema.parse(fields) };
      case "founder-one-pager":
        return { ok: true, data: founderOnePagerFieldsSchema.parse(fields) };
      case "job-post-generator":
        return { ok: true, data: jobPostFieldsSchema.parse(fields) };
    }
    return { ok: false, error: "Unknown tool." };
  } catch (e) {
    if (e instanceof z.ZodError) {
      return {
        ok: false,
        error: e.issues.map((i) => i.message).join(" "),
      };
    }
    return { ok: false, error: "Invalid input." };
  }
}
