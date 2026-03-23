import { FEATURE_FLAGS_KV_KEY } from "@/lib/feature-flags-constants";
import {
  resolveFeatureFlagsFromStored,
  type FeatureFlagKey,
} from "@/lib/feature-flags-schema";

function hasKvEnv(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

/**
 * Edge middleware only: no Node `fs`. Returns null if KV is not configured.
 */
export async function getResolvedFeatureFlagsFromKvOnly(): Promise<Record<
  FeatureFlagKey,
  boolean
> | null> {
  if (!hasKvEnv()) return null;
  try {
    const { kv } = await import("@vercel/kv");
    const data = await kv.get(FEATURE_FLAGS_KV_KEY);
    const values =
      data && typeof data === "object" && data !== null && "values" in data
        ? ((data as { values: Record<string, boolean> }).values ?? {})
        : {};
    return resolveFeatureFlagsFromStored(values);
  } catch {
    return null;
  }
}
