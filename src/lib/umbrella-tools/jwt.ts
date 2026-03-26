/** Decode JWT parts in the browser (read-only; does not verify signatures). */

function base64UrlToJson(part: string): unknown {
  let b64 = part.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4;
  if (pad) b64 += "=".repeat(4 - pad);
  const json = atob(b64);
  return JSON.parse(json) as unknown;
}

export function decodeJwtToken(token: string):
  | { header: unknown; payload: unknown; signatureB64: string }
  | { error: string } {
  const trimmed = token.trim();
  if (!trimmed) return { error: "Paste a JWT." };
  const parts = trimmed.split(".");
  if (parts.length < 2) return { error: "Expected three segments: header.payload.signature" };
  try {
    const header = base64UrlToJson(parts[0]);
    const payload = base64UrlToJson(parts[1]);
    return { header, payload, signatureB64: parts[2] ?? "" };
  } catch {
    return { error: "Could not decode header or payload (invalid Base64URL or JSON)." };
  }
}
