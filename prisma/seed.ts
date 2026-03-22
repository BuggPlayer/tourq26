import { PrismaClient } from "@prisma/client";
import {
  companyTagsSeed,
  preparationPlansSeed,
  questionsSeed,
} from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.forumPost.deleteMany();
  await prisma.forumThread.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.mockInterviewBooking.deleteMany();
  await prisma.talentPoolEntry.deleteMany();
  await prisma.jobPosting.deleteMany();
  await prisma.userPlanEnrollment.deleteMany();
  await prisma.preparationPlan.deleteMany();
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
    const connect = (companyTagNames ?? []).map((name) => ({
      id: tagMap.get(name)!,
    }));
    await prisma.question.create({
      data: {
        ...rest,
        companyTags: connect.length ? { connect } : undefined,
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
        skills: JSON.stringify(["Next.js", "TypeScript", "PostgreSQL"]),
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

  console.log("Seed complete: tags, plans, questions, jobs.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
