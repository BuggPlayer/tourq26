import { describe, expect, it } from "vitest";
import { decodeBase32, encodeBase32 } from "./base32";

describe("base32", () => {
  it("round-trips UTF-8 text", () => {
    const s = "Hello, 世界";
    const enc = encodeBase32(new TextEncoder().encode(s));
    const dec = new TextDecoder().decode(decodeBase32(enc));
    expect(dec).toBe(s);
  });

  it("decodes known vector (RFC 4648)", () => {
    const decoded = new TextDecoder().decode(decodeBase32("JBSWY3DPEBLW64TMMQ======"));
    expect(decoded).toBe("Hello World");
  });
});
