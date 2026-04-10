/** Origin of the standalone Torq DevTools deployment (no trailing slash), from env. */
export function getExternalDevToolsOrigin(): string | null {
  const u = process.env.NEXT_PUBLIC_DEV_TOOLS_URL?.trim();
  if (!u) return null;
  return u.replace(/\/$/, "");
}
