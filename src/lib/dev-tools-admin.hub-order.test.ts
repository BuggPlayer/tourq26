import { describe, expect, it } from "vitest";
import type { DevToolsAdminDocument } from "@/lib/content";
import {
  resolveHubSlugOrderForCategory,
  sanitizeHubSlugOrderByCategory,
} from "@/lib/dev-tools-admin";

describe("resolveHubSlugOrderForCategory", () => {
  it("uses registry order when doc is null", () => {
    const order = resolveHubSlugOrderForCategory("text", null);
    expect(order.length).toBeGreaterThan(0);
    expect(new Set(order).size).toBe(order.length);
  });

  it("respects saved order and appends new registry slugs", () => {
    const base = resolveHubSlugOrderForCategory("text", null);
    if (base.length < 2) return;
    const reversed = [...base].reverse();
    const doc: DevToolsAdminDocument = {
      overrides: {},
      hubSlugOrderByCategory: { text: reversed },
      updatedAt: "",
    };
    const merged = resolveHubSlugOrderForCategory("text", doc);
    expect(merged.slice(0, reversed.length)).toEqual(reversed);
  });
});

describe("sanitizeHubSlugOrderByCategory", () => {
  it("returns undefined for invalid top-level type", () => {
    expect(sanitizeHubSlugOrderByCategory("x")).toBeUndefined();
    expect(sanitizeHubSlugOrderByCategory([1, 2])).toBeUndefined();
  });

  it("returns empty object for null", () => {
    expect(sanitizeHubSlugOrderByCategory(null)).toEqual({});
  });

  it("drops unknown slugs and fills missing registry slugs", () => {
    const textSlugs = resolveHubSlugOrderForCategory("text", null);
    const first = textSlugs[0];
    if (!first) return;
    const out = sanitizeHubSlugOrderByCategory({
      text: ["not-a-real-slug", first],
    });
    expect(out?.text?.includes(first)).toBe(true);
    expect(out?.text?.includes("not-a-real-slug")).toBe(false);
    expect(out?.text?.length).toBe(textSlugs.length);
  });
});
