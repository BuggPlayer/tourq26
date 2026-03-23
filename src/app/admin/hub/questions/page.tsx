import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";

export default async function AdminQuestionsPage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  const questions = await prisma.question.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      type: true,
      title: true,
      topic: true,
      difficulty: true,
      framework: true,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Interview questions</h1>
        <Link
          href="/admin/hub/questions/new"
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
        >
          New question
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-700/50">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-700 bg-slate-800/40 text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Topic</th>
              <th className="px-4 py-3 font-medium">Difficulty</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id} className="border-b border-slate-800/80 hover:bg-slate-800/20">
                <td className="px-4 py-3 text-slate-300">{q.type}</td>
                <td className="max-w-xs truncate px-4 py-3 text-slate-200">{q.title}</td>
                <td className="px-4 py-3 text-slate-400">{q.topic}</td>
                <td className="px-4 py-3 text-slate-400">{q.difficulty}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/hub/questions/${q.id}`}
                    className="text-cyan-400 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {questions.length === 0 && (
          <p className="p-8 text-center text-slate-500">No questions. Seed or create.</p>
        )}
      </div>
    </div>
  );
}
