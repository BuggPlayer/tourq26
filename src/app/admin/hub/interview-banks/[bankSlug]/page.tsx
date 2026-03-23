import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";
import { InterviewBankItemsTable } from "./InterviewBankItemsTable";

type Props = { params: Promise<{ bankSlug: string }> };

export default async function AdminInterviewBankDetailPage({ params }: Props) {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  const { bankSlug } = await params;
  const slug = decodeURIComponent(bankSlug);
  const bank = await prisma.interviewQuestionBank.findUnique({
    where: { slug },
  });
  if (!bank) notFound();

  const [items, categories] = await Promise.all([
    prisma.interviewBankItem.findMany({
      where: { bankId: bank.id },
      include: { category: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.interviewBankCategory.findMany({
      where: { bankId: bank.id },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const enc = encodeURIComponent(slug);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/hub/interview-banks"
            className="text-sm text-cyan-400 hover:underline"
          >
            ← All banks
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-white">{bank.label}</h1>
          <p className="mt-1 font-mono text-sm text-slate-500">{bank.slug}</p>
          <p className="mt-1 text-slate-400">
            {items.length} items · {categories.length} categories
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/hub/interview-banks/${enc}/categories`}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            Edit categories
          </Link>
          <Link
            href={`/admin/hub/interview-banks/${enc}/new`}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
          >
            New question
          </Link>
        </div>
      </div>
      <InterviewBankItemsTable bankSlug={slug} initialItems={items} />
    </div>
  );
}
