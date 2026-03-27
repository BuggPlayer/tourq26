import { describe, expect, it } from "vitest";
import { extractPlaylistId } from "./extract-playlist-id";

describe("extractPlaylistId", () => {
  it("parses standard playlist URLs", () => {
    expect(
      extractPlaylistId("https://www.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf"),
    ).toBe("PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf");
    expect(extractPlaylistId("https://youtube.com/playlist?list=PLabc123")).toBe("PLabc123");
  });

  it("parses watch URLs with list=", () => {
    expect(
      extractPlaylistId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLtestplaylistid12"),
    ).toBe("PLtestplaylistid12");
  });

  it("accepts bare playlist IDs", () => {
    expect(extractPlaylistId("PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf")).toBe(
      "PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf",
    );
  });

  it("returns null for invalid input", () => {
    expect(extractPlaylistId("")).toBeNull();
    expect(extractPlaylistId("https://youtube.com/watch?v=abc")).toBeNull();
  });
});
