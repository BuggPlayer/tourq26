import Link from "next/link";
import { HiringToolkit } from "@/components/hub/HiringToolkit";

export default function HiringPage() {
  return (
    <div className="space-y-8">
      <Link href="/hub" className="text-sm text-cyan-400 hover:underline">
        ← Hub home
      </Link>
      <header>
        <h1 className="font-display text-3xl font-bold text-white">
          Hiring manager mode
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Generate role-aligned interview prompts from title, stack, and seniority,
          export to PDF, then publish roles on the job board.
        </p>
      </header>
      <HiringToolkit />
      <p className="text-sm text-slate-500">
        Next:{" "}
        <Link href="/hub/jobs/new" className="text-cyan-400 hover:underline">
          Post a job →
        </Link>
      </p>
    </div>
  );
}
