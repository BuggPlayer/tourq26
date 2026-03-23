import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";

export default async function AdminPlansPage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  const plans = await prisma.preparationPlan.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Preparation plans</h1>
        <Link
          href="/admin/hub/plans/new"
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
        >
          New plan
        </Link>
      </div>
      <ul className="mt-6 space-y-2">
        {plans.map((p) => (
          <li key={p.id}>
            <Link
              href={`/admin/hub/plans/${encodeURIComponent(p.slug)}`}
              className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/30 px-4 py-3 transition hover:border-cyan-500/30"
            >
              <span className="font-medium text-white">{p.name}</span>
              <span className="font-mono text-xs text-slate-500">{p.slug}</span>
            </Link>
          </li>
        ))}
      </ul>
      {plans.length === 0 && <p className="mt-6 text-slate-500">No plans. Seed or create one.</p>}
    </div>
  );
}
