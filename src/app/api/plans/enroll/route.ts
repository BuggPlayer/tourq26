import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/hub/auth";
import { guardHubBackend } from "@/lib/hub/hub-backend-flag";
import { prisma } from "@/lib/hub/prisma";

const bodySchema = z.object({
  planId: z.string(),
});

export async function POST(req: Request) {
  const denied = await guardHubBackend();
  if (denied) return denied;

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    await prisma.userPlanEnrollment.upsert({
      where: {
        userId_planId: { userId: session.user.id, planId: parsed.data.planId },
      },
      create: {
        userId: session.user.id,
        planId: parsed.data.planId,
      },
      update: {},
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
