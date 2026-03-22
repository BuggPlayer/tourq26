import { prisma } from "./prisma";

/**
 * Launch mode: every hub feature is open with no payment or tier checks.
 * Set to `false` when you re-enable Stripe, submission caps, and premium-only labs.
 */
export const HUB_ALL_FREE_LAUNCH = true;

const FREE_MONTHLY_LIMIT = 10;

/** Resets monthly counter if we're in a new calendar month (used when billing is on). */
export async function refreshMonthlyWindow(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { monthResetAt: true, monthlyQuestionViews: true, subscriptionTier: true },
  });
  if (!user) return null;
  if (user.subscriptionTier === "premium" || user.subscriptionTier === "student") {
    return { unlimited: true as const, views: user.monthlyQuestionViews };
  }
  const now = new Date();
  const reset = user.monthResetAt;
  const sameMonth =
    reset &&
    reset.getUTCFullYear() === now.getUTCFullYear() &&
    reset.getUTCMonth() === now.getUTCMonth();
  if (!sameMonth) {
    await prisma.user.update({
      where: { id: userId },
      data: { monthlyQuestionViews: 0, monthResetAt: now },
    });
    return { unlimited: false as const, views: 0, limit: FREE_MONTHLY_LIMIT };
  }
  return { unlimited: false as const, views: user.monthlyQuestionViews, limit: FREE_MONTHLY_LIMIT };
}

export async function assertCanSubmit(
  userId: string | undefined,
  tier: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (HUB_ALL_FREE_LAUNCH) {
    return { ok: true };
  }
  if (!userId) {
    return { ok: false, message: "Sign in to submit solutions." };
  }
  if (tier === "premium" || tier === "student") {
    return { ok: true };
  }
  const window = await refreshMonthlyWindow(userId);
  if (!window || window.unlimited) return { ok: true };
  if (window.views >= FREE_MONTHLY_LIMIT) {
    return {
      ok: false,
      message: `Free plan allows ${FREE_MONTHLY_LIMIT} submissions per month. Upgrade for unlimited access.`,
    };
  }
  return { ok: true };
}

export async function incrementMonthlySubmissions(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { monthlyQuestionViews: { increment: 1 } },
  });
}

export function needsPremiumGate(_tier: string): boolean {
  if (HUB_ALL_FREE_LAUNCH) return false;
  return _tier !== "premium" && _tier !== "student";
}
