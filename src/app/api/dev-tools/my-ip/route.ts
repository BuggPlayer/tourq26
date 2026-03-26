import { headers } from "next/headers";

export async function GET() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const real = h.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || real || "unknown";
  return Response.json({ ip });
}
