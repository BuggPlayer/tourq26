import {
  NODEJS_QA_CATEGORIES,
  nodeJsInterviewQA,
  type NodeJsQAItem,
  type NodeJsQABullet,
  searchableTextForItem,
} from "@/data/nodejs-interview-qa";
import { prisma } from "@/lib/hub/prisma";
import { isHubBackendFull } from "@/lib/hub/hub-backend-flag";

export { searchableTextForItem };

export type InterviewBankSummary = {
  slug: string;
  label: string;
  description: string | null;
  sortOrder: number;
};

type ItemRow = {
  publicId: string;
  question: string;
  answer: string;
  difficulty: string | null;
  categoryBadge: string | null;
  answerIntro: string | null;
  bulletsJson: string | null;
  codeExample: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  category: { slug: string };
};

function rowToItem(row: ItemRow): NodeJsQAItem {
  let bullets: NodeJsQABullet[] | undefined;
  if (row.bulletsJson) {
    try {
      const parsed = JSON.parse(row.bulletsJson) as unknown;
      if (Array.isArray(parsed)) bullets = parsed as NodeJsQABullet[];
    } catch {
      /* ignore */
    }
  }
  const source =
    row.sourceName != null
      ? {
          name: row.sourceName,
          ...(row.sourceUrl ? { url: row.sourceUrl } : {}),
        }
      : undefined;
  return {
    id: row.publicId,
    categoryId: row.category.slug,
    question: row.question,
    answer: row.answer,
    difficulty: (row.difficulty as NodeJsQAItem["difficulty"]) ?? undefined,
    categoryBadge: row.categoryBadge ?? undefined,
    answerIntro: row.answerIntro ?? undefined,
    bullets,
    codeExample: row.codeExample ?? undefined,
    source,
  };
}

async function getBankIdBySlug(bankSlug: string): Promise<string | null> {
  const b = await prisma.interviewQuestionBank.findUnique({
    where: { slug: bankSlug },
    select: { id: true },
  });
  return b?.id ?? null;
}

async function loadItemsFromDb(bankSlug: string): Promise<NodeJsQAItem[] | null> {
  const bankId = await getBankIdBySlug(bankSlug);
  if (!bankId) return null;
  const count = await prisma.interviewBankItem.count({ where: { bankId } });
  if (count === 0) return null;
  const rows = await prisma.interviewBankItem.findMany({
    where: { bankId },
    include: { category: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((r) =>
    rowToItem({
      publicId: r.publicId,
      question: r.question,
      answer: r.answer,
      difficulty: r.difficulty,
      categoryBadge: r.categoryBadge,
      answerIntro: r.answerIntro,
      bulletsJson: r.bulletsJson,
      codeExample: r.codeExample,
      sourceName: r.sourceName,
      sourceUrl: r.sourceUrl,
      category: { slug: r.category.slug },
    }),
  );
}

function staticFallbackForBank(bankSlug: string): NodeJsQAItem[] | null {
  if (bankSlug === "nodejs") return nodeJsInterviewQA;
  return null;
}

/** Canonical ordered list: DB when hub + rows exist, else bundled static fallback for `nodejs` only. */
export async function getInterviewBankQA(bankSlug: string): Promise<NodeJsQAItem[]> {
  if (!(await isHubBackendFull())) {
    return staticFallbackForBank(bankSlug) ?? [];
  }
  const fromDb = await loadItemsFromDb(bankSlug);
  if (fromDb != null) return fromDb;
  return staticFallbackForBank(bankSlug) ?? [];
}

export type InterviewCategoryOption = { id: string; label: string };

export async function getInterviewBankCategoriesUi(
  bankSlug: string,
): Promise<readonly InterviewCategoryOption[]> {
  if (!(await isHubBackendFull())) {
    if (bankSlug === "nodejs") return NODEJS_QA_CATEGORIES;
    return [{ id: "all", label: "All topics" }];
  }
  const bankId = await getBankIdBySlug(bankSlug);
  if (!bankId) {
    if (bankSlug === "nodejs") return NODEJS_QA_CATEGORIES;
    return [{ id: "all", label: "All topics" }];
  }
  const cats = await prisma.interviewBankCategory.findMany({
    where: { bankId },
    orderBy: { sortOrder: "asc" },
  });
  if (cats.length === 0) {
    if (bankSlug === "nodejs") return NODEJS_QA_CATEGORIES;
    return [{ id: "all", label: "All topics" }];
  }
  return [
    { id: "all", label: "All topics" },
    ...cats.map((c) => ({ id: c.slug, label: c.label })),
  ];
}

export async function getInterviewQAByPublicId(
  bankSlug: string,
  publicId: string,
): Promise<NodeJsQAItem | undefined> {
  const items = await getInterviewBankQA(bankSlug);
  return items.find((x) => x.id === publicId);
}

export async function getInterviewBankItemCount(bankSlug: string): Promise<number> {
  const items = await getInterviewBankQA(bankSlug);
  return items.length;
}

export async function getGlobalQuestionNumber(
  bankSlug: string,
  publicId: string,
): Promise<number> {
  const items = await getInterviewBankQA(bankSlug);
  const i = items.findIndex((q) => q.id === publicId);
  return i >= 0 ? i + 1 : 0;
}

/** Metadata for a single bank; `null` if the slug does not exist (or hub off and not `nodejs`). */
export async function getInterviewBankMeta(
  bankSlug: string,
): Promise<InterviewBankSummary | null> {
  if (!(await isHubBackendFull())) {
    if (bankSlug === "nodejs") {
      return {
        slug: "nodejs",
        label: "JavaScript & Node.js",
        description: null,
        sortOrder: 0,
      };
    }
    return null;
  }
  const b = await prisma.interviewQuestionBank.findUnique({
    where: { slug: bankSlug },
    select: { slug: true, label: true, description: true, sortOrder: true },
  });
  return b;
}

export async function listInterviewBanksPublic(): Promise<InterviewBankSummary[]> {
  if (!(await isHubBackendFull())) {
    return [
      {
        slug: "nodejs",
        label: "JavaScript & Node.js",
        description: null,
        sortOrder: 0,
      },
    ];
  }
  const rows = await prisma.interviewQuestionBank.findMany({
    orderBy: { sortOrder: "asc" },
    select: { slug: true, label: true, description: true, sortOrder: true },
  });
  if (rows.length === 0) {
    return [
      {
        slug: "nodejs",
        label: "JavaScript & Node.js",
        description: null,
        sortOrder: 0,
      },
    ];
  }
  return rows;
}

export async function getInterviewBanksWithCounts(): Promise<
  { slug: string; label: string; itemCount: number }[]
> {
  if (!(await isHubBackendFull())) {
    return [
      {
        slug: "nodejs",
        label: "JavaScript & Node.js",
        itemCount: nodeJsInterviewQA.length,
      },
    ];
  }
  const banks = await prisma.interviewQuestionBank.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { items: true } } },
  });
  if (banks.length === 0) {
    return [
      {
        slug: "nodejs",
        label: "JavaScript & Node.js",
        itemCount: nodeJsInterviewQA.length,
      },
    ];
  }
  return banks.map((b) => ({
    slug: b.slug,
    label: b.label,
    itemCount: b._count.items,
  }));
}

/** Batch lookup for client “continue reading” (titles only). */
export async function resolveInterviewTitlesByPublicIds(
  bankSlug: string,
  publicIds: string[],
): Promise<{ id: string; question: string }[]> {
  const unique = [...new Set(publicIds)].filter(Boolean);
  if (unique.length === 0) return [];
  const staticFb = staticFallbackForBank(bankSlug);
  if (!(await isHubBackendFull())) {
    return unique
      .map((id) => {
        const q = staticFb?.find((x) => x.id === id);
        return q ? { id, question: q.question } : null;
      })
      .filter((x): x is { id: string; question: string } => x != null);
  }
  const bankId = await getBankIdBySlug(bankSlug);
  if (!bankId) {
    return unique
      .map((id) => {
        const q = staticFb?.find((x) => x.id === id);
        return q ? { id, question: q.question } : null;
      })
      .filter((x): x is { id: string; question: string } => x != null);
  }
  const rows = await prisma.interviewBankItem.findMany({
    where: { bankId, publicId: { in: unique } },
    select: { publicId: true, question: true },
  });
  const byId = new Map(rows.map((r) => [r.publicId, r.question]));
  return unique
    .map((id) => {
      const q = byId.get(id);
      if (q) return { id, question: q };
      const fb = staticFb?.find((x) => x.id === id);
      return fb ? { id, question: fb.question } : null;
    })
    .filter((x): x is { id: string; question: string } => x != null);
}
