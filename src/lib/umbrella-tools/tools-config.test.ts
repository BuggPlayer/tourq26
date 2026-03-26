import { describe, expect, it } from "vitest";
import { filterUmbrellaTools, getRelatedDevTools } from "./tools-config";

describe("filterUmbrellaTools", () => {
  it("returns all when query empty", () => {
    const all = filterUmbrellaTools("");
    const subset = filterUmbrellaTools("   ");
    expect(subset.length).toBe(all.length);
  });

  it("matches category label", () => {
    const r = filterUmbrellaTools("network");
    expect(r.some((t) => t.slug === "cidr-calculator")).toBe(true);
  });
});

describe("getRelatedDevTools", () => {
  it("prefers same category", () => {
    const related = getRelatedDevTools("json-formatter", 10);
    expect(related[0]?.category).toBe("json");
    expect(related.every((t) => t.slug !== "json-formatter")).toBe(true);
  });

  it("returns empty for unknown slug", () => {
    expect(getRelatedDevTools("nonexistent-slug")).toEqual([]);
  });
});
