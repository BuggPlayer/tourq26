import { prisma } from "@/lib/hub/prisma";
import { nodeJsInterviewQA } from "@/data/nodejs-interview-qa";

/** Used when Prisma/DB is unreachable (missing DATABASE_URL, SQLite on serverless, etc.). */
export function hubLandingStatsFallback(): HubLandingStats {
  const n = nodeJsInterviewQA.length;
  return {
    total: n,
    dsa: 0,
    ui: 0,
    fsd: 0,
    quiz: 0,
    nodejsQaBank: n,
    uiVanilla: 0,
    uiReact: 0,
    uiVue: 0,
    uiAngular: 0,
    uiSvelte: 0,
    quizJs: 0,
    quizReact: 0,
    topicArrays: 0,
    topicGraphs: 0,
    topicDp: 0,
  };
}

export type HubLandingStats = {
  total: number;
  dsa: number;
  ui: number;
  fsd: number;
  quiz: number;
  nodejsQaBank: number;
  uiVanilla: number;
  uiReact: number;
  uiVue: number;
  uiAngular: number;
  uiSvelte: number;
  quizJs: number;
  quizReact: number;
  topicArrays: number;
  topicGraphs: number;
  topicDp: number;
};

export async function getHubLandingStats(): Promise<HubLandingStats> {
  try {
    const [
      total,
      dsa,
      ui,
      fsd,
      quiz,
      uiVanilla,
      uiReact,
      uiVue,
      uiAngular,
      uiSvelte,
      quizJs,
      quizReact,
      topicArrays,
      topicGraphs,
      topicDp,
    ] = await Promise.all([
      prisma.question.count(),
      prisma.question.count({ where: { type: "DSA" } }),
      prisma.question.count({ where: { type: "UI" } }),
      prisma.question.count({ where: { type: "FRONTEND_SYSTEM_DESIGN" } }),
      prisma.question.count({ where: { type: "QUIZ" } }),
      prisma.question.count({ where: { type: "UI", framework: "vanilla" } }),
      prisma.question.count({ where: { type: "UI", framework: "react" } }),
      prisma.question.count({ where: { type: "UI", framework: "vue" } }),
      prisma.question.count({ where: { type: "UI", framework: "angular" } }),
      prisma.question.count({ where: { type: "UI", framework: "svelte" } }),
      prisma.question.count({ where: { type: "QUIZ", topic: "javascript" } }),
      prisma.question.count({ where: { type: "QUIZ", topic: "react" } }),
      prisma.question.count({ where: { type: "DSA", topic: "arrays" } }),
      prisma.question.count({ where: { type: "DSA", topic: "graphs" } }),
      prisma.question.count({ where: { type: "DSA", topic: "dp" } }),
    ]);

    return {
      total,
      dsa,
      ui,
      fsd,
      quiz,
      nodejsQaBank: nodeJsInterviewQA.length,
      uiVanilla,
      uiReact,
      uiVue,
      uiAngular,
      uiSvelte,
      quizJs,
      quizReact,
      topicArrays,
      topicGraphs,
      topicDp,
    };
  } catch (err) {
    // Avoid 500 on /hub when DB is misconfigured (common: SQLite on Vercel, missing DATABASE_URL).
    console.error("[getHubLandingStats] database unavailable:", err);
    return hubLandingStatsFallback();
  }
}
