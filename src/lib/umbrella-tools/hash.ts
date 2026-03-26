export type HashAlgorithm = "SHA-256" | "SHA-384" | "SHA-512";

export async function digestText(algorithm: HashAlgorithm, text: string): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest(algorithm, buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
