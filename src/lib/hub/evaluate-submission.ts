import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import type { Question } from "@prisma/client";
import { runPiston, type PistonLanguage } from "./piston";

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (typeof a === "object" && typeof b === "object") {
    const ak = Object.keys(a as object).sort();
    const bk = Object.keys(b as object).sort();
    if (ak.length !== bk.length) return false;
    return ak.every((k) => deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
  }
  return false;
}

function parseStdoutJson(stdout: string): unknown {
  const t = stdout.trim();
  try {
    return JSON.parse(t);
  } catch {
    try {
      return JSON.parse(t.replace(/'/g, '"'));
    } catch {
      return t;
    }
  }
}

function ruleBasedFeedback(passed: boolean, question: Question): string {
  if (passed) {
    return "All automated checks passed. Review edge cases and complexity in a real interview.";
  }
  return `Automated checks did not match the expected output. Re-read the problem, trace a small example, and compare with the official approach: ${question.officialSolution ?? "see editorial in hub."}`;
}

async function openAiFeedback(params: {
  question: Question;
  code: string;
  language: string;
  stdout: string;
  stderr: string;
  passed: boolean;
}): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const openai = createOpenAI({ apiKey: key });
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `You are an interview coach. Question: ${params.question.title}\nDescription: ${params.question.description}\nLanguage: ${params.language}\nPassed tests: ${params.passed}\nStdout: ${params.stdout}\nStderr: ${params.stderr}\nUser code:\n${params.code}\nGive concise, encouraging feedback (max 120 words) with one improvement tip.`,
  });
  return text;
}

export type SubmitResult = {
  passed: boolean;
  score: number;
  feedback: string;
  stdout?: string;
  stderr?: string;
};

export async function evaluateSubmission(params: {
  question: Question;
  code: string;
  language: PistonLanguage;
  extra?: { uiHtml?: string; systemDesignTypes?: string[] };
}): Promise<SubmitResult> {
  const { question, code, language } = params;
  const testsRaw = question.tests;

  if (question.type === "QUIZ") {
    return {
      passed: true,
      score: 100,
      feedback: "Use the quiz API for answer checking; this endpoint is for code/UI.",
    };
  }

  if (question.type === "UI") {
    const html = params.extra?.uiHtml ?? code;
    if (!testsRaw) {
      return { passed: false, score: 0, feedback: "No tests configured for this challenge." };
    }
    const spec = JSON.parse(testsRaw) as { kind?: string; mustContain?: string[] };
    if (spec.kind !== "ui" || !spec.mustContain?.length) {
      return { passed: false, score: 0, feedback: "Invalid UI test spec." };
    }
    const missing = spec.mustContain.filter((s) => !html.includes(s));
    const passed = missing.length === 0;
    const score = passed ? 100 : 40;
    const ai =
      (await openAiFeedback({
        question,
        code: html.slice(0, 4000),
        language: "html",
        stdout: "",
        stderr: missing.join(", "),
        passed,
      })) ?? ruleBasedFeedback(passed, question);
    return { passed, score, feedback: ai };
  }

  if (question.type === "FRONTEND_SYSTEM_DESIGN") {
    const metaSource = question.systemDesignMeta ?? testsRaw;
    if (!metaSource) {
      return { passed: false, score: 0, feedback: "No official solution metadata." };
    }
    const spec = JSON.parse(metaSource) as { officialNodeTypes?: string[] };
    const need = new Set(spec.officialNodeTypes ?? []);
    const got = new Set(params.extra?.systemDesignTypes ?? []);
    const passed = [...need].every((t) => got.has(t)) && got.size >= need.size;
    const score = passed ? 100 : 55;
    const feedback =
      (await openAiFeedback({
        question,
        code: [...got].join(","),
        language: "system-design",
        stdout: "",
        stderr: "",
        passed,
      })) ??
      (passed
        ? "You included the core building blocks. Compare with the official narrative in the solution panel."
        : `Place these nodes: ${[...need].join(", ")}.`);
    return { passed, score, feedback };
  }

  // DSA
  if (!testsRaw) {
    return { passed: false, score: 0, feedback: "No tests for this question." };
  }
  const spec = JSON.parse(testsRaw) as {
    kind?: string;
    jsHarness?: string;
    pyHarness?: string;
    expectedJson?: unknown;
  };
  if (spec.kind !== "dsa") {
    return { passed: false, score: 0, feedback: "Unsupported DSA test format." };
  }

  const harness =
    language === "javascript"
      ? spec.jsHarness
      : language === "python"
        ? spec.pyHarness
        : null;

  if (!harness || spec.expectedJson === undefined) {
    const pistonTry = await runPiston(language, code).catch((e: Error) => ({
      stdout: "",
      stderr: e.message,
      code: 1,
      signal: null as string | null,
    }));
    const ranOk = "code" in pistonTry && pistonTry.code === 0;
    const ai =
      (await openAiFeedback({
        question,
        code,
        language,
        stdout: "stdout" in pistonTry ? pistonTry.stdout : "",
        stderr: "stderr" in pistonTry ? pistonTry.stderr : "",
        passed: ranOk,
      })) ??
      (ranOk
        ? "Code runs without errors. For full auto-grading, use JavaScript or Python on this question."
        : "Execution failed or language not auto-graded. Try JavaScript or Python, or fix runtime errors.");
    return {
      passed: ranOk,
      score: ranOk ? 70 : 25,
      feedback: ai,
      stdout: "stdout" in pistonTry ? pistonTry.stdout : undefined,
      stderr: "stderr" in pistonTry ? pistonTry.stderr : undefined,
    };
  }

  const full = `${code}\n${harness}`;
  const run = await runPiston(language, full);
  const parsed = parseStdoutJson(run.stdout);
  const passed = deepEqual(parsed, spec.expectedJson);
  const score = passed ? 100 : run.stderr ? 20 : 45;
  const ai =
    (await openAiFeedback({
      question,
      code,
      language,
      stdout: run.stdout,
      stderr: run.stderr,
      passed,
    })) ?? ruleBasedFeedback(passed, question);
  return {
    passed,
    score,
    feedback: ai,
    stdout: run.stdout,
    stderr: run.stderr,
  };
}
