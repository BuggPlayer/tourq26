import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";
import { QuestionForm } from "../QuestionForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditQuestionPage({ params }: Props) {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  const { id } = await params;
  const [question, tags] = await Promise.all([
    prisma.question.findUnique({
      where: { id },
      include: { companyTagLinks: { include: { companyTag: true } } },
    }),
    prisma.companyTag.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!question) redirect("/admin/hub/questions");

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Edit question</h1>
      <p className="mt-1 font-mono text-xs text-slate-500">{question.id}</p>
      <QuestionForm
        companyTags={tags}
        initial={{
          id: question.id,
          type: question.type,
          title: question.title,
          description: question.description,
          difficulty: question.difficulty,
          topic: question.topic,
          framework: question.framework ?? "",
          defaultLanguage: question.defaultLanguage ?? "",
          starterCode: question.starterCode ?? "",
          tests: question.tests ?? "",
          officialSolution: question.officialSolution ?? "",
          systemDesignMeta: question.systemDesignMeta ?? "",
          companyTagNames: question.companyTagLinks.map((l) => l.companyTag.name),
        }}
      />
    </div>
  );
}
