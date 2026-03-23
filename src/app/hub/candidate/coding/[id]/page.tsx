import { notFound } from "next/navigation";
import { DsaWorkspace } from "@/components/hub/DsaWorkspace";
import { HubBackendOffline } from "@/components/hub/HubBackendOffline";
import { isHubBackendFull } from "@/lib/hub/hub-backend-flag";
import { prisma } from "@/lib/hub/prisma";

export default async function CodingProblemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isHubBackendFull())) {
    return <HubBackendOffline />;
  }
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
