import { notFound } from "next/navigation";
import { prisma } from "@/lib/hub/prisma";
import { UiWorkspace } from "@/components/hub/UiWorkspace";

export default async function UiChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const q = await prisma.question.findUnique({ where: { id } });
  if (!q || q.type !== "UI") notFound();
  const starter = q.starterCode ? JSON.parse(q.starterCode) : { html: "" };
  return (
    <UiWorkspace
      questionId={q.id}
      title={q.title}
      description={q.description}
      initialHtml={starter.html ?? ""}
      framework={q.framework ?? "vanilla"}
    />
  );
}
