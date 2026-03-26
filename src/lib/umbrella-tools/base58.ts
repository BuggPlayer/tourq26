/** Bitcoin-style Base58 (no checksum). */
const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export function encodeBase58(bytes: Uint8Array): string {
  let zeros = 0;
  while (zeros < bytes.length && bytes[zeros] === 0) zeros++;

  const sub = bytes.subarray(zeros);
  if (sub.length === 0) {
    return zeros > 0 ? "1".repeat(zeros) : "";
  }

  let num = BigInt(0);
  for (let i = 0; i < sub.length; i++) {
    num = num * BigInt(256) + BigInt(sub[i]!);
  }

  let out = "";
  while (num > BigInt(0)) {
    const rem = Number(num % BigInt(58));
    num = num / BigInt(58);
    out = ALPHABET[rem]! + out;
  }

  return "1".repeat(zeros) + out;
}

export function decodeBase58(s: string): Uint8Array {
  const str = s.trim();
  if (!str) return new Uint8Array(0);

  let zeros = 0;
  while (zeros < str.length && str[zeros] === "1") zeros++;

  const rest = str.slice(zeros);
  if (rest.length === 0) {
    return new Uint8Array(zeros);
  }

  let num = BigInt(0);
  for (const c of rest) {
    const idx = ALPHABET.indexOf(c);
    if (idx < 0) throw new Error(`Invalid Base58 character: ${c}`);
    num = num * BigInt(58) + BigInt(idx);
  }

  const digits: number[] = [];
  if (num === BigInt(0)) {
    digits.push(0);
  } else {
    while (num > BigInt(0)) {
      digits.push(Number(num % BigInt(256)));
      num = num / BigInt(256);
    }
    digits.reverse();
  }

  const body = new Uint8Array(digits);
  const out = new Uint8Array(zeros + body.length);
  out.set(body, zeros);
  return out;
}
