import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readContactSubmissions } from "@/lib/content";

export async function GET() {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const submissions = await readContactSubmissions();
  return NextResponse.json(submissions);
}
