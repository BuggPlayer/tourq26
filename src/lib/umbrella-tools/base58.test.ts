import { describe, expect, it } from "vitest";
import { decodeBase58, encodeBase58 } from "./base58";

describe("base58", () => {
  it("round-trips bytes", () => {
    const bytes = new TextEncoder().encode("test vector");
    const enc = encodeBase58(bytes);
    const out = new TextDecoder().decode(decodeBase58(enc));
    expect(out).toBe("test vector");
  });

  it("encodes leading zero bytes as ones", () => {
    const bytes = new Uint8Array([0, 0, 1]);
    expect(encodeBase58(bytes).startsWith("11")).toBe(true);
  });
});
