import { describe, expect, it } from "vitest";
import { base64UrlToUtf8, utf8ToBase64Url } from "./paste-url";

describe("paste-url", () => {
  it("round-trips ASCII and Unicode", () => {
    const samples = ["hello", "line1\nline2", "你好 🌍"];
    for (const s of samples) {
      expect(base64UrlToUtf8(utf8ToBase64Url(s))).toBe(s);
    }
  });
});
