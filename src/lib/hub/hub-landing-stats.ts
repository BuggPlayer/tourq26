import { prisma } from "@/lib/hub/prisma";
import { nodeJsInterviewQA } from "@/data/nodejs-interview-qa";

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
}
