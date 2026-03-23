import Link from "next/link";
import { listInterviewBanksPublic } from "@/lib/hub/interview-bank-data";

export default async function InterviewBanksIndexPage() {
  const banks = await listInterviewBanksPublic();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <nav aria-label="Breadcrumb">
        <Link
          href="/hub/candidate"
          className="text-sm font-medium text-cyan-400 underline-offset-2 hover:underline"
        >
          ← Candidate hub
        </Link>
      </nav>
      <h1 className="mt-4 font-display text-3xl font-bold text-white">Interview Q&amp;A banks</h1>
      <p className="mt-2 text-sm text-slate-400">
        Theory-focused question banks with expandable answers and a full-page reading mode.
      </p>
      <ul className="mt-8 space-y-3">
        {banks.map((b) => (
          <li key={b.slug}>
            <Link
              href={`/hub/candidate/interview/${b.slug}`}
              className="block rounded-xl border border-slate-700/80 bg-slate-900/40 px-4 py-4 transition-colors hover:border-cyan-800/60 hover:bg-slate-900/70"
            >
              <span className="font-semibold text-slate-100">{b.label}</span>
              {b.description ? (
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">{b.description}</p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
