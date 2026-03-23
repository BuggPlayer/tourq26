import { notFound } from "next/navigation";
import { HubBackendOffline } from "@/components/hub/HubBackendOffline";
import { UiWorkspace } from "@/components/hub/UiWorkspace";
import { isHubBackendFull } from "@/lib/hub/hub-backend-flag";
import { prisma } from "@/lib/hub/prisma";

export default async function UiChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isHubBackendFull())) {
    return <HubBackendOffline />;
  }
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
