import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";
import { InterviewBankItemForm } from "../../InterviewBankItemForm";

type Props = { params: Promise<{ bankSlug: string; publicId: string }> };

export default async function EditInterviewBankItemPage({ params }: Props) {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  const { bankSlug, publicId } = await params;
  const slug = decodeURIComponent(bankSlug);
  const bank = await prisma.interviewQuestionBank.findUnique({
    where: { slug },
  });
  if (!bank) notFound();

  const pid = decodeURIComponent(publicId);
  const [item, categories] = await Promise.all([
    prisma.interviewBankItem.findUnique({
      where: {
        bankId_publicId: { bankId: bank.id, publicId: pid },
      },
      include: { category: true },
    }),
    prisma.interviewBankCategory.findMany({
      where: { bankId: bank.id },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  if (!item) redirect(`/admin/hub/interview-banks/${encodeURIComponent(slug)}`);

  const enc = encodeURIComponent(slug);

  return (
    <div>
      <Link href={`/admin/hub/interview-banks/${enc}`} className="text-sm text-cyan-400 hover:underline">
        ← Back
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-white">Edit Q&amp;A — {bank.label}</h1>
      <p className="mt-1 font-mono text-sm text-slate-500">publicId: {item.publicId}</p>
      <InterviewBankItemForm
        bankSlug={slug}
        categories={categories}
        initial={{
          publicId: item.publicId,
          categorySlug: item.category.slug,
          question: item.question,
          answer: item.answer,
          difficulty: item.difficulty ?? "",
          categoryBadge: item.categoryBadge ?? "",
          answerIntro: item.answerIntro ?? "",
          bulletsJson: item.bulletsJson ?? "",
          codeExample: item.codeExample ?? "",
          sourceName: item.sourceName ?? "",
          sourceUrl: item.sourceUrl ?? "",
          sortOrder: item.sortOrder,
        }}
      />
    </div>
  );
}
