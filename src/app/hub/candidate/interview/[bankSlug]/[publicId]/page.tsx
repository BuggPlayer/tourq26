import { notFound } from "next/navigation";
import { NodeJsInterviewFullPage } from "@/components/hub/NodeJsInterviewFullPage";
import {
  getInterviewBankCategoriesUi,
  getInterviewBankMeta,
  getInterviewBankQA,
  getGlobalQuestionNumber,
  getInterviewQAByPublicId,
} from "@/lib/hub/interview-bank-data";

type Props = { params: Promise<{ bankSlug: string; publicId: string }> };

export async function generateMetadata({ params }: Props) {
  const { bankSlug, publicId } = await params;
  const slug = decodeURIComponent(bankSlug);
  const id = decodeURIComponent(publicId);
  const item = await getInterviewQAByPublicId(slug, id);
  if (!item) return { title: "Question" };
  const t =
    item.question.length > 72 ? `${item.question.slice(0, 72)}…` : item.question;
  return { title: t };
}

export default async function InterviewBankQuestionPage({ params }: Props) {
  const { bankSlug, publicId } = await params;
  const slug = decodeURIComponent(bankSlug);
  const id = decodeURIComponent(publicId);
  const meta = await getInterviewBankMeta(slug);
  if (!meta) notFound();

  const item = await getInterviewQAByPublicId(slug, id);
  if (!item) notFound();

  const [all, qNum, categories] = await Promise.all([
    getInterviewBankQA(slug),
    getGlobalQuestionNumber(slug, id),
    getInterviewBankCategoriesUi(slug),
  ]);

  const basePath = `/hub/candidate/interview/${slug}`;

  return (
    <NodeJsInterviewFullPage
      item={item}
      qNum={qNum}
      total={all.length}
      bankSlug={slug}
      basePath={basePath}
      categories={categories}
      ctaBankLabel={meta.label}
    />
  );
}
