import { NextResponse } from "next/server";

/**
 * Interview Hub database-backed APIs and Prisma-powered stats.
 *
 * Set **`HUB_BACKEND_FULL=false`** in env to disable hub APIs (deploy kill switch).
 * NextAuth may still require a database if you use `PrismaAdapter`; this does not disable auth.
 */
export async function isHubBackendFull(): Promise<boolean> {
  const v = process.env.HUB_BACKEND_FULL?.trim().toLowerCase();
  if (v === "false" || v === "0" || v === "off" || v === "no") {
    return false;
  }
  return true;
}

export function hubBackendDisabledResponse(): NextResponse {
  return NextResponse.json(
    {
      error: "hub_backend_disabled",
      message:
        "Interview Hub database API is disabled. Set HUB_BACKEND_FULL=true and a valid DATABASE_URL to enable.",
    },
    { status: 503 },
  );
}

export async function guardHubBackend(): Promise<NextResponse | null> {
  return (await isHubBackendFull()) ? null : hubBackendDisabledResponse();
}
