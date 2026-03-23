import { NextResponse } from "next/server";
import { getResolvedFeatureFlags } from "@/lib/feature-flags";

/**
 * Interview Hub database-backed APIs and Prisma-powered stats.
 *
 * - **`HUB_BACKEND_FULL=false` in env** — always off (deploy kill switch).
 * - **Admin feature flag `hub_database_api`** — persisted in KV / `content/feature-flags.json`.
 * - **`FF_HUB_DATABASE_API`** env — overrides the admin toggle when set to true/false.
 *
 * NextAuth may still require a database if you use `PrismaAdapter`; this flag does not disable auth.
 */
export async function isHubBackendFull(): Promise<boolean> {
  const v = process.env.HUB_BACKEND_FULL?.trim().toLowerCase();
  if (v === "false" || v === "0" || v === "off" || v === "no") {
    return false;
  }
  const flags = await getResolvedFeatureFlags();
  return flags.hub_database_api;
}

export function hubBackendDisabledResponse(): NextResponse {
  return NextResponse.json(
    {
      error: "hub_backend_disabled",
      message:
        "Interview Hub database API is disabled. Set HUB_BACKEND_FULL=true and a valid DATABASE_URL, or enable the hub in Admin → Feature flags.",
    },
    { status: 503 },
  );
}

export async function guardHubBackend(): Promise<NextResponse | null> {
  return (await isHubBackendFull()) ? null : hubBackendDisabledResponse();
}
