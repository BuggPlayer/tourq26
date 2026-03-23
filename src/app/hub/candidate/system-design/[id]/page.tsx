import { notFound } from "next/navigation";
import { HubBackendOffline } from "@/components/hub/HubBackendOffline";
import { SystemDesignWorkspace } from "@/components/hub/SystemDesignWorkspace";
import { isHubBackendFull } from "@/lib/hub/hub-backend-flag";
import { prisma } from "@/lib/hub/prisma";

export default async function SystemDesignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isHubBackendFull())) {
    return <HubBackendOffline />;
  }
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
