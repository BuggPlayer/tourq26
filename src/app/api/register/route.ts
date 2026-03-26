import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { guardHubBackend } from "@/lib/hub/hub-backend-flag";
import { prisma } from "@/lib/hub/prisma";

const bodySchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export async function POST(req: Request) {
  const denied = await guardHubBackend();
  if (denied) return denied;
  const regOff = process.env.HUB_ALLOW_REGISTRATION?.trim().toLowerCase();
  if (regOff === "false" || regOff === "0" || regOff === "off" || regOff === "no") {
    return NextResponse.json(
      { error: "registration_disabled", message: "New sign-ups are temporarily disabled." },
      { status: 503 },
    );
  }

  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { name, email, password } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "candidate",
        subscriptionTier: "free",
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
