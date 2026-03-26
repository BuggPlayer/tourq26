import { describe, expect, it } from "vitest";
import { crc32 } from "./crc32";

function utf8(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

describe("crc32", () => {
  it("matches known vector for ASCII string 123456789", () => {
    expect(crc32(utf8("123456789"))).toBe(0xcbf43926);
  });

  it("empty input", () => {
    expect(crc32(new Uint8Array(0))).toBe(0);
  });
});
