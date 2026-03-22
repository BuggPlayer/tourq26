import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/hub/auth";
import { prisma } from "@/lib/hub/prisma";

const postSchema = z.object({
  companyName: z.string().min(1).max(120),
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(8000),
  location: z.string().min(1).max(200),
  skills: z.array(z.string()).min(1).max(24),
});

export async function GET() {
  const jobs = await prisma.jobPosting.findMany({
    orderBy: { createdAt: "desc" },
    take: 80,
    select: {
      id: true,
      companyName: true,
      title: true,
      description: true,
      location: true,
      skills: true,
      createdAt: true,
    },
  });
  return NextResponse.json({
    jobs: jobs.map((j) => ({
      ...j,
      skills: JSON.parse(j.skills) as string[],
    })),
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to post a job." }, { status: 401 });
  }
  try {
    const json = await req.json();
    const parsed = postSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid job payload" }, { status: 400 });
    }
    const { companyName, title, description, location, skills } = parsed.data;
    const job = await prisma.jobPosting.create({
      data: {
        companyName,
        title,
        description,
        location,
        skills: JSON.stringify(skills),
        postedById: session.user.id,
      },
    });
    return NextResponse.json({ id: job.id });
  } catch {
    return NextResponse.json({ error: "Could not create job" }, { status: 500 });
  }
}
