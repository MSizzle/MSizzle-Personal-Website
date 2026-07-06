import { describe, it, expect } from "vitest";
import { extractYouTubeId, getLovesItems } from "@/lib/notion-loves";

describe("extractYouTubeId", () => {
  it("parses a standard watch URL", () => {
    expect(extractYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
  });

  it("parses a youtu.be short URL", () => {
    expect(extractYouTubeId("https://youtu.be/abc123def45")).toBe("abc123def45");
  });

  it("parses an embed URL", () => {
    expect(extractYouTubeId("https://www.youtube.com/embed/abc123def45")).toBe(
      "abc123def45"
    );
  });

  it("returns null for a non-YouTube URL", () => {
    expect(extractYouTubeId("https://example.com/watch?v=nope")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(extractYouTubeId("")).toBeNull();
  });
});

describe("getLovesItems (gating)", () => {
  it("returns [] when NOTION_LOVES_DB_ID is not configured", async () => {
    // The test env has no NOTION_LOVES_DB_ID, so the guard short-circuits with
    // no network call — this is the fallback that keeps the homepage safe.
    delete process.env.NOTION_LOVES_DB_ID;
    const items = await getLovesItems();
    expect(items).toEqual([]);
  });
});
