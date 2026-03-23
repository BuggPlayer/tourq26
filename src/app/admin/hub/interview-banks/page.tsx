import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";
import { CreateInterviewBankForm } from "./CreateInterviewBankForm";

export default async function AdminInterviewBanksPage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  const banks = await prisma.interviewQuestionBank.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { items: true, categories: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Interview Q&amp;A banks</h1>
      <p className="mt-1 max-w-2xl text-slate-400">
        Each bank has its own categories and questions. Candidates open them at{" "}
        <code className="text-cyan-400/90">/hub/candidate/interview/[slug]</code>.
      </p>

      <CreateInterviewBankForm />

      <ul className="mt-10 space-y-2">
        {banks.map((b) => (
          <li key={b.id}>
            <Link
              href={`/admin/hub/interview-banks/${encodeURIComponent(b.slug)}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700/50 bg-slate-800/30 px-4 py-3 transition hover:border-cyan-500/40"
            >
              <div>
                <span className="font-semibold text-white">{b.label}</span>
                <span className="ml-2 font-mono text-sm text-cyan-400/80">{b.slug}</span>
              </div>
              <span className="text-sm text-slate-500">
                {b._count.items} items · {b._count.categories} categories
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {banks.length === 0 ? (
        <p className="mt-6 text-slate-500">No banks yet. Create one above or run npm run db:seed.</p>
      ) : null}
    </div>
  );
}
