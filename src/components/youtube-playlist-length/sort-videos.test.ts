import { describe, expect, it } from "vitest";
import { parseStoredListSort } from "./sort-videos";

describe("parseStoredListSort", () => {
  it("parses preset kind", () => {
    expect(parseStoredListSort({ kind: "preset", preset: "views" })).toEqual({
      kind: "preset",
      preset: "views",
    });
  });

  it("parses column kind", () => {
    expect(parseStoredListSort({ kind: "column", key: "duration", dir: "asc" })).toEqual({
      kind: "column",
      key: "duration",
      dir: "asc",
    });
  });

  it("rejects invalid payloads", () => {
    expect(parseStoredListSort(null)).toBeNull();
    expect(parseStoredListSort({ kind: "preset", preset: "nope" })).toBeNull();
    expect(parseStoredListSort({ kind: "column", key: "duration", dir: "sideways" })).toBeNull();
  });
});
