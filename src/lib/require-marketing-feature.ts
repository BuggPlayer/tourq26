import { redirect } from "next/navigation";
import { isFeatureEnabled, type FeatureFlagKey } from "@/lib/feature-flags";

/** Server-only: redirect when a marketing section is turned off (file + KV stores). */
export async function requireMarketingFeature(flag: FeatureFlagKey, queryKey: string) {
  if (!(await isFeatureEnabled(flag))) {
    redirect(`/feature-unavailable?k=${encodeURIComponent(queryKey)}`);
  }
}
