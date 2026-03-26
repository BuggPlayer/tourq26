/** RFC 4648 Base32 (no line breaks). */
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function encodeBase32(bytes: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i];
    bits += 8;
    while (bits >= 5) {
      out += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    out += ALPHABET[(value << (5 - bits)) & 31];
  }
  while (out.length % 8 !== 0) {
    out += "=";
  }
  return out;
}

export function decodeBase32(s: string): Uint8Array {
  const cleaned = s.replace(/\s/g, "").replace(/=+$/g, "").toUpperCase();
  if (!cleaned) return new Uint8Array(0);
  const map = new Map<string, number>();
  for (let i = 0; i < ALPHABET.length; i++) map.set(ALPHABET[i]!, i);

  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of cleaned) {
    const idx = map.get(ch);
    if (idx === undefined) throw new Error(`Invalid Base32 character: ${ch}`);
    value = (value << 5) | idx;
    bits += 5;
    while (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(out);
}
