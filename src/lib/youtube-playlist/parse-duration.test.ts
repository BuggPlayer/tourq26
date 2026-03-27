import { describe, expect, it } from "vitest";
import { parseIso8601Duration } from "./parse-duration";

describe("parseIso8601Duration", () => {
  it("parses hours, minutes, seconds", () => {
    expect(parseIso8601Duration("PT1H2M3S")).toBe(3600 + 120 + 3);
    expect(parseIso8601Duration("PT45S")).toBe(45);
    expect(parseIso8601Duration("PT3M")).toBe(180);
  });

  it("parses days and weeks when present", () => {
    expect(parseIso8601Duration("P1DT2H")).toBe(86400 + 7200);
    expect(parseIso8601Duration("P1W")).toBe(604800);
  });

  it("returns 0 for empty or invalid", () => {
    expect(parseIso8601Duration("")).toBe(0);
    expect(parseIso8601Duration("not-a-duration")).toBe(0);
  });
});
