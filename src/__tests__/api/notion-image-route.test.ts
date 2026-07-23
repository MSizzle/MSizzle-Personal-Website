/**
 * Tests for /api/notion-image route Cache-Control headers.
 * Quick task 260723-g2q, Task 1 (FIX 2: hard proxy caching).
 *
 * Asserts:
 * (a) success (200) response carries the new long-lived Cache-Control string
 * (b) error (404, image not found) response carries no Cache-Control header at all
 */
import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";

const EXPECTED_CACHE_CONTROL =
  "public, max-age=300, s-maxage=31536000, stale-while-revalidate=86400";

vi.mock("@/lib/notion", () => ({
  getFreshImageUrl: vi.fn(async (blockId: string) =>
    blockId === "missing" ? null : "https://example.com/inline.jpg"
  ),
}));

vi.stubGlobal(
  "fetch",
  vi.fn(async () => ({
    ok: true,
    body: new ReadableStream(),
    headers: { get: () => "image/jpeg" },
  }))
);

describe("/api/notion-image Cache-Control (260723-g2q Task 1)", () => {
  it("success response has the exact long-lived Cache-Control string", async () => {
    const { GET } = await import("@/app/api/notion-image/route");
    const res = await GET(
      new NextRequest("http://localhost:3000/api/notion-image?blockId=abc")
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe(EXPECTED_CACHE_CONTROL);
  });

  it("error response (image not found -> 404) has no Cache-Control header", async () => {
    const { GET } = await import("@/app/api/notion-image/route");
    const res = await GET(
      new NextRequest("http://localhost:3000/api/notion-image?blockId=missing")
    );
    expect(res.status).toBe(404);
    expect(res.headers.get("Cache-Control")).toBeNull();
  });
});
