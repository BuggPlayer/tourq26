import { readFeatureFlagsDocument, writeFeatureFlagsDocument } from "@/lib/content";
import {
  FEATURE_FLAG_DEFINITIONS,
  FEATURE_FLAG_KEYS,
  resolveFeatureFlagsFromStored,
  type FeatureFlagDefinition,
  type FeatureFlagKey,
} from "@/lib/feature-flags-schema";

export {
  FEATURE_FLAG_DEFINITIONS,
  FEATURE_FLAG_KEYS,
  type FeatureFlagDefinition,
  type FeatureFlagKey,
} from "@/lib/feature-flags-schema";

export async function getResolvedFeatureFlags(): Promise<Record<FeatureFlagKey, boolean>> {
  const doc = await readFeatureFlagsDocument();
  return resolveFeatureFlagsFromStored(doc?.values ?? {});
}

export async function isFeatureEnabled(key: FeatureFlagKey): Promise<boolean> {
  const all = await getResolvedFeatureFlags();
  return all[key];
}

export async function saveFeatureFlagValues(
  values: Partial<Record<FeatureFlagKey, boolean>>,
): Promise<Record<FeatureFlagKey, boolean>> {
  const current = await getResolvedFeatureFlags();
  const next: Record<FeatureFlagKey, boolean> = { ...current };
  for (const k of FEATURE_FLAG_KEYS) {
    if (typeof values[k] === "boolean") next[k] = values[k]!;
  }
  await writeFeatureFlagsDocument({
    values: next,
    updatedAt: new Date().toISOString(),
  });
  return next;
}

export function isValidFeatureFlagKey(k: string): k is FeatureFlagKey {
  return (FEATURE_FLAG_KEYS as readonly string[]).includes(k);
}

export function getFeatureFlagCatalogForAdmin(): FeatureFlagDefinition[] {
  return [...FEATURE_FLAG_DEFINITIONS];
}
