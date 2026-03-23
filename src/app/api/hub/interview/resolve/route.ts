import { NextRequest, NextResponse } from "next/server";
import { resolveInterviewTitlesByPublicIds } from "@/lib/hub/interview-bank-data";

export async function GET(req: NextRequest) {
  const bank =
    req.nextUrl.searchParams.get("bank")?.trim().replace(/[^a-z0-9-]/g, "") ||
    "nodejs";
  const idsParam = req.nextUrl.searchParams.get("ids") ?? "";
  const publicIds = idsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);
  const items = await resolveInterviewTitlesByPublicIds(bank, publicIds);
  return NextResponse.json({ items });
}
