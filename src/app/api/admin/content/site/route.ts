import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { readSiteContent, writeSiteContent, type SiteContent } from "@/lib/content";

export async function GET() {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await readSiteContent();
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const ok = await requireAdmin();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as Partial<SiteContent>;
  const current = await readSiteContent();
  const data: SiteContent = {
    ...current,
    ...body,
    keywords: Array.isArray(body.keywords) ? body.keywords : current.keywords,
    sameAs: Array.isArray(body.sameAs)
      ? (body.sameAs as unknown[]).filter((u): u is string => typeof u === "string")
      : current.sameAs,
    twitterSite:
      typeof body.twitterSite === "string"
        ? body.twitterSite.replace(/^@/, "").trim()
        : current.twitterSite,
  };
  await writeSiteContent(data);
  revalidatePath("/");
  return NextResponse.json(data);
}
