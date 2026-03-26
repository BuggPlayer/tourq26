import CryptoJS from "crypto-js";

export const HASH_ALGORITHMS = [
  "MD5",
  "SHA-1",
  "SHA-224",
  "SHA-256",
  "SHA-384",
  "SHA-512",
  "SHA3-256",
  "RIPEMD160",
] as const;

export type HashAlgorithmId = (typeof HASH_ALGORITHMS)[number];

function wordArray(text: string) {
  return CryptoJS.enc.Utf8.parse(text);
}

/** Hex digest using crypto-js (client-side, for MD5 / SHA-1 / SHA-3 / RIPEMD, etc.). */
export function hashHexDigest(algorithm: HashAlgorithmId, text: string): string {
  const wa = wordArray(text);
  switch (algorithm) {
    case "MD5":
      return CryptoJS.MD5(wa).toString(CryptoJS.enc.Hex);
    case "SHA-1":
      return CryptoJS.SHA1(wa).toString(CryptoJS.enc.Hex);
    case "SHA-224":
      return CryptoJS.SHA224(wa).toString(CryptoJS.enc.Hex);
    case "SHA-256":
      return CryptoJS.SHA256(wa).toString(CryptoJS.enc.Hex);
    case "SHA-384":
      return CryptoJS.SHA384(wa).toString(CryptoJS.enc.Hex);
    case "SHA-512":
      return CryptoJS.SHA512(wa).toString(CryptoJS.enc.Hex);
    case "SHA3-256":
      return CryptoJS.SHA3(wa, { outputLength: 256 }).toString(CryptoJS.enc.Hex);
    case "RIPEMD160":
      return CryptoJS.RIPEMD160(wa).toString(CryptoJS.enc.Hex);
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }
}

export const HMAC_ALGORITHMS = HASH_ALGORITHMS;

export type HmacAlgorithmId = HashAlgorithmId;

export function hmacHexDigest(algorithm: HmacAlgorithmId, secret: string, message: string): string {
  const key = CryptoJS.enc.Utf8.parse(secret);
  const msg = CryptoJS.enc.Utf8.parse(message);
  switch (algorithm) {
    case "MD5":
      return CryptoJS.HmacMD5(msg, key).toString(CryptoJS.enc.Hex);
    case "SHA-1":
      return CryptoJS.HmacSHA1(msg, key).toString(CryptoJS.enc.Hex);
    case "SHA-224":
      return CryptoJS.HmacSHA224(msg, key).toString(CryptoJS.enc.Hex);
    case "SHA-256":
      return CryptoJS.HmacSHA256(msg, key).toString(CryptoJS.enc.Hex);
    case "SHA-384":
      return CryptoJS.HmacSHA384(msg, key).toString(CryptoJS.enc.Hex);
    case "SHA-512":
      return CryptoJS.HmacSHA512(msg, key).toString(CryptoJS.enc.Hex);
    case "SHA3-256":
      return CryptoJS.HmacSHA3(msg, key).toString(CryptoJS.enc.Hex);
    case "RIPEMD160":
      return CryptoJS.HmacRIPEMD160(msg, key).toString(CryptoJS.enc.Hex);
    default:
      throw new Error(`Unsupported HMAC: ${algorithm}`);
  }
}
