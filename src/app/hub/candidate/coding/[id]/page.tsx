import { notFound } from "next/navigation";
import { prisma } from "@/lib/hub/prisma";
import { DsaWorkspace } from "@/components/hub/DsaWorkspace";

export default async function CodingProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const q = await prisma.question.findUnique({ where: { id } });
  if (!q || q.type !== "DSA") notFound();
  const starter = q.starterCode ? JSON.parse(q.starterCode) : {};
  return (
    <DsaWorkspace
      questionId={q.id}
      title={q.title}
      description={q.description}
      defaultLanguage={(q.defaultLanguage as "javascript") ?? "javascript"}
      starterByLang={starter}
    />
  );
}
