import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";
import { QuestionForm } from "../QuestionForm";

export default async function NewQuestionPage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  const tags = await prisma.companyTag.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">New interview question</h1>
      <QuestionForm companyTags={tags} />
    </div>
  );
}
