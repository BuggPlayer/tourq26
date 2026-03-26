import { NextResponse } from "next/server";
import * as ts from "typescript";
import { z } from "zod";
import { runPiston, type PistonLanguage } from "@/lib/hub/piston";

const bodySchema = z.object({
  code: z.string().max(500_000),
  language: z.enum(["javascript", "typescript", "python", "java", "cpp", "go"]),
});

function transpileTypeScript(source: string): string {
  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      strict: false,
    },
    reportDiagnostics: true,
  });
  const diagnostics = result.diagnostics ?? [];
  const err = diagnostics.filter((d) => d.category === ts.DiagnosticCategory.Error);
  if (err.length > 0) {
    const text = err
      .map((d) => {
        const msg = ts.flattenDiagnosticMessageText(d.messageText, "\n");
        const pos = d.file && d.start !== undefined ? d.file.getLineAndCharacterOfPosition(d.start) : null;
        return pos ? `Line ${pos.line + 1}: ${msg}` : msg;
      })
      .join("\n");
    throw new Error(`TypeScript:\n${text}`);
  }
  return result.outputText;
}

/** Fast sandbox run via Piston (no grading). TypeScript is transpiled then run as JavaScript. */
export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    let { code, language } = parsed.data;
    if (language === "typescript") {
      code = transpileTypeScript(code);
      language = "javascript";
    }
    const run = await runPiston(language as PistonLanguage, code);
    return NextResponse.json(run);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Run failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
