import { PrismaClient } from "@prisma/client";
import {
  NODEJS_QA_CATEGORIES,
  nodeJsInterviewQA,
} from "../src/data/nodejs-interview-qa";
import {
  companyTagsSeed,
  preparationPlansSeed,
  questionsSeed,
} from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.interviewBankItem.deleteMany();
  await prisma.interviewBankCategory.deleteMany();
  await prisma.interviewQuestionBank.deleteMany();
  await prisma.forumPost.deleteMany();
  await prisma.forumThread.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.mockInterviewBooking.deleteMany();
  await prisma.talentPoolEntry.deleteMany();
  await prisma.jobPosting.deleteMany();
  await prisma.userPlanEnrollment.deleteMany();
  await prisma.preparationPlan.deleteMany();
  await prisma.questionCompanyTag.deleteMany();
  await prisma.question.deleteMany();
  await prisma.companyTag.deleteMany();

  const tagMap = new Map<string, string>();
  for (const t of companyTagsSeed) {
    const row = await prisma.companyTag.create({ data: t });
    tagMap.set(t.name, row.id);
  }

  for (const p of preparationPlansSeed) {
    await prisma.preparationPlan.create({ data: p });
  }

  for (const q of questionsSeed) {
    const { companyTagNames, ...rest } = q;
    const linkCreates = (companyTagNames ?? []).map((name) => ({
      companyTagId: tagMap.get(name)!,
    }));
    await prisma.question.create({
      data: {
        ...rest,
        companyTagLinks:
          linkCreates.length > 0 ? { create: linkCreates } : undefined,
      },
    });
  }

  const nodeBank = await prisma.interviewQuestionBank.create({
    data: {
      slug: "nodejs",
      label: "JavaScript & Node.js",
      description: "Hoisting, closures, event loop, streams, modules — seeded from legacy static bank.",
      sortOrder: 0,
    },
  });

  let catOrder = 0;
  const catIdBySlug = new Map<string, string>();
  for (const c of NODEJS_QA_CATEGORIES) {
    if (c.id === "all") continue;
    const row = await prisma.interviewBankCategory.create({
      data: {
        bankId: nodeBank.id,
        slug: c.id,
        label: c.label,
        sortOrder: catOrder++,
      },
    });
    catIdBySlug.set(c.id, row.id);
  }
  for (let i = 0; i < nodeJsInterviewQA.length; i++) {
    const q = nodeJsInterviewQA[i];
    const categoryId = catIdBySlug.get(q.categoryId);
    if (!categoryId) {
      console.warn("Skipping Node QA item — unknown category:", q.categoryId, q.id);
      continue;
    }
    await prisma.interviewBankItem.create({
      data: {
        bankId: nodeBank.id,
        publicId: q.id,
        categoryId,
        question: q.question,
        answer: q.answer,
        difficulty: q.difficulty ?? null,
        categoryBadge: q.categoryBadge ?? null,
        answerIntro: q.answerIntro ?? null,
        bulletsJson: q.bullets ? JSON.stringify(q.bullets) : null,
        codeExample: q.codeExample ?? null,
        sourceName: q.source?.name ?? null,
        sourceUrl: q.source?.url ?? null,
        sortOrder: i,
      },
    });
  }

  await prisma.jobPosting.createMany({
    data: [
      {
        companyName: "TorqStudio",
        title: "Senior Full-Stack Engineer",
        description:
          "Next.js, Prisma, system design. Remote-friendly within India.",
        location: "Bengaluru / Remote",
        skills: JSON.stringify(["Next.js", "TypeScript", "MongoDB"]),
      },
      {
        companyName: "Acme Labs",
        title: "Frontend Engineer (React)",
        description: "Design systems, performance, accessibility.",
        location: "Hyderabad",
        skills: JSON.stringify(["React", "TypeScript", "CSS"]),
      },
    ],
  });

  console.log("Seed complete: tags, plans, questions, jobs, interview Q&A banks (nodejs).");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
