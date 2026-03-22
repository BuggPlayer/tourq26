import { NextResponse } from "next/server";
import { z } from "zod";
import { runPiston, type PistonLanguage } from "@/lib/hub/piston";

const bodySchema = z.object({
  code: z.string(),
  language: z.enum(["javascript", "python", "java", "cpp", "go"]),
});

/** Fast sandbox run via Piston (no grading). */
export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const run = await runPiston(
      parsed.data.language as PistonLanguage,
      parsed.data.code,
    );
    return NextResponse.json(run);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Run failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
