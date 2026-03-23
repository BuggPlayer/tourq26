import { notFound } from "next/navigation";
import { CafeStyleInterviewQA } from "@/components/hub/CafeStyleInterviewQA";
import {
  getInterviewBankCategoriesUi,
  getInterviewBankMeta,
  getInterviewBankQA,
} from "@/lib/hub/interview-bank-data";

type Props = { params: Promise<{ bankSlug: string }> };

export default async function InterviewBankPage({ params }: Props) {
  const { bankSlug } = await params;
  const decoded = decodeURIComponent(bankSlug);
  const meta = await getInterviewBankMeta(decoded);
  if (!meta) notFound();

  const [items, categories] = await Promise.all([
    getInterviewBankQA(decoded),
    getInterviewBankCategoriesUi(decoded),
  ]);

  const basePath = `/hub/candidate/interview/${decoded}`;
  const hubTitle = `${meta.label} interview questions`;
  const hubTagline = meta.description?.trim()
    ? meta.description
    : `Curated Q&A — filter by topic, search, or open full page for reading and a local scratch editor.`;

  return (
    <CafeStyleInterviewQA
      items={items}
      categories={categories}
      basePath={basePath}
      hubTitle={hubTitle}
      hubTagline={hubTagline}
      ctaBankLabel={meta.label}
    />
  );
}
