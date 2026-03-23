import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";
import { InterviewBankItemForm } from "../InterviewBankItemForm";

type Props = { params: Promise<{ bankSlug: string }> };

export default async function NewInterviewBankItemPage({ params }: Props) {
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
      <Link href={`/admin/hub/interview-banks/${enc}`} className="text-sm text-cyan-400 hover:underline">
        ← Back
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-white">New Q&amp;A — {bank.label}</h1>
      <InterviewBankItemForm bankSlug={slug} categories={categories} />
    </div>
  );
}
