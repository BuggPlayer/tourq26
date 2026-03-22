import { notFound } from "next/navigation";
import { prisma } from "@/lib/hub/prisma";
import { SystemDesignWorkspace } from "@/components/hub/SystemDesignWorkspace";

export default async function SystemDesignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const q = await prisma.question.findUnique({ where: { id } });
  if (!q || q.type !== "FRONTEND_SYSTEM_DESIGN") notFound();
  const meta = q.systemDesignMeta ? JSON.parse(q.systemDesignMeta) : {};
  return (
    <SystemDesignWorkspace
      questionId={q.id}
      title={q.title}
      description={q.description}
      officialTypes={meta.officialNodeTypes ?? []}
      officialSolution={q.officialSolution ?? ""}
    />
  );
}
