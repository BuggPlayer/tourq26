import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NodeJsInterviewFullPage } from "@/components/hub/NodeJsInterviewFullPage";
import {
  getNodeJsQAById,
  globalQuestionNumber,
  nodeJsInterviewQA,
} from "@/data/nodejs-interview-qa";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return nodeJsInterviewQA.map((q) => ({ id: q.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = getNodeJsQAById(id);
  if (!item) return { title: "Question | TorqStudio" };
  return {
    title: `${item.question} | TorqStudio Interview Hub`,
    description: item.answer.slice(0, 160),
  };
}

export default async function NodeJsInterviewQuestionPage({ params }: PageProps) {
  const { id } = await params;
  const item = getNodeJsQAById(id);
  if (!item) notFound();

  const qNum = globalQuestionNumber(item.id);
  const total = nodeJsInterviewQA.length;

  return <NodeJsInterviewFullPage item={item} qNum={qNum} total={total} />;
}
