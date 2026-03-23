import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";
import { InterviewBankCategoriesClient } from "../InterviewBankCategoriesClient";

type Props = { params: Promise<{ bankSlug: string }> };

export default async function AdminInterviewBankCategoriesPage({ params }: Props) {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  const { bankSlug } = await params;
  const slug = decodeURIComponent(bankSlug);
  const bank = await prisma.interviewQuestionBank.findUnique({
    where: { slug },
  });
  if (!bank) notFound();

  const categories = await prisma.interviewBankCategory.findMany({
    where: { bankId: bank.id },
    orderBy: { sortOrder: "asc" },
  });

  const enc = encodeURIComponent(slug);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Categories — {bank.label}</h1>
        <Link
          href={`/admin/hub/interview-banks/${enc}`}
          className="text-sm text-cyan-400 hover:underline"
        >
          ← Back to items
        </Link>
      </div>
      <InterviewBankCategoriesClient bankSlug={slug} initialCategories={categories} />
    </div>
  );
}
