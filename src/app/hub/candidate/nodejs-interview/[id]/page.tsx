import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function LegacyNodeJsInterviewQuestionRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/hub/candidate/interview/nodejs/${encodeURIComponent(id)}`);
}
