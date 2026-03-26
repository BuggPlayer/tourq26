/** Base64url (no padding) for UTF-8 text in URL query params. */

export function utf8ToBase64Url(text: string): string {
  const b64 = btoa(unescape(encodeURIComponent(text)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function base64UrlToUtf8(s: string): string {
  let b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4;
  if (pad) b64 += "=".repeat(4 - pad);
  return decodeURIComponent(escape(atob(b64)));
}
