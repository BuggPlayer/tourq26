/**
 * Back-compat wrappers for the legacy `nodejs` bank.
 * Prefer `@/lib/hub/interview-bank-data` with an explicit `bankSlug` for new code.
 */
import {
  getInterviewBankCategoriesUi,
  getInterviewBankItemCount,
  getInterviewBankQA,
  getGlobalQuestionNumber as getGlobalQuestionNumberForBank,
  getInterviewQAByPublicId,
  resolveInterviewTitlesByPublicIds,
  searchableTextForItem,
  type InterviewCategoryOption,
} from "@/lib/hub/interview-bank-data";

const BANK = "nodejs";

export { searchableTextForItem };

export async function getNodeJsInterviewQA() {
  return getInterviewBankQA(BANK);
}

export type NodeJsCategoryOption = InterviewCategoryOption;

export async function getNodeJsInterviewCategoriesUi() {
  return getInterviewBankCategoriesUi(BANK);
}

export async function getNodeJsQAByPublicId(publicId: string) {
  return getInterviewQAByPublicId(BANK, publicId);
}

export async function getNodeJsInterviewBankCount() {
  return getInterviewBankItemCount(BANK);
}

export async function getGlobalQuestionNumber(publicId: string) {
  return getGlobalQuestionNumberForBank(BANK, publicId);
}

export async function resolveNodeJsTitlesByPublicIds(publicIds: string[]) {
  return resolveInterviewTitlesByPublicIds(BANK, publicIds);
}
