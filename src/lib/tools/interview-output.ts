import { z } from "zod";
import { INTERVIEW_TRACK_IDS } from "./schemas";

const TRACKS = INTERVIEW_TRACK_IDS as unknown as [string, ...string[]];

export const INTERVIEW_TRACK_ENUM = z.enum(TRACKS);

const candidateItemSchema = z.object({
  question: z.string().min(5).max(900),
  answer: z.string().min(10).max(4500),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.array(z.string().max(40)).max(6).optional(),
});

const candidateSectionSchema = z.object({
  track: INTERVIEW_TRACK_ENUM,
  items: z.array(candidateItemSchema).min(3).max(6),
});

/** Candidate mode structured output */
export const interviewCandidateOutputSchema = z.object({
  intro: z.string().min(20).max(2500),
  studyPlan: z.array(z.string().max(400)).max(14).optional(),
  sections: z.array(candidateSectionSchema).min(1).max(4),
});

const hiringItemSchema = z.object({
  question: z.string().min(5).max(900),
  rubricHints: z.string().min(10).max(2000),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

const hiringSectionSchema = z.object({
  track: INTERVIEW_TRACK_ENUM,
  items: z.array(hiringItemSchema).min(4).max(8),
});

const scorecardRowSchema = z.object({
  competency: z.string().max(200),
  goodLooksLike: z.string().max(500),
});

const roundSchema = z.object({
  name: z.string().max(120),
  focus: z.string().max(500),
  durationHint: z.string().max(80),
});

/** Hiring mode structured output */
export const interviewHiringOutputSchema = z.object({
  scorecard: z.array(scorecardRowSchema).min(4).max(8),
  rounds: z.array(roundSchema).min(2).max(5),
  sections: z.array(hiringSectionSchema).min(1).max(4),
  inclusiveTips: z.array(z.string().max(400)).max(6).optional(),
  redFlags: z.array(z.string().max(300)).max(8).optional(),
});

export type InterviewCandidateOutput = z.infer<typeof interviewCandidateOutputSchema>;
export type InterviewHiringOutput = z.infer<typeof interviewHiringOutputSchema>;
