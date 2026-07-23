/**
 * Tests for /api/notion-cover route Cache-Control headers.
 * Quick task 260723-g2q, Task 1 (FIX 2: hard proxy caching).
 *
 * Asserts:
 * (a) success (200) response carries the new long-lived Cache-Control string
 * (b) error (404, no cover) response carries no Cache-Control header at all
 */
import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";

const EXPECTED_CACHE_CONTROL =
  "public, max-age=300, s-maxage=31536000, stale-while-revalidate=86400";

// Single shared retrieve mock, dispatched by page_id so both the success and
// error test can share one module-level Client instance (the route module
// constructs `new Client(...)` once at import time, so per-test
// mockImplementationOnce on the constructor would not take effect for a
// module already imported by an earlier test in this file).
vi.mock("@notionhq/client", () => ({
  Client: vi.fn().mockImplementation(function (this: unknown) {
    return {
      pages: {
        retrieve: vi.fn(async ({ page_id }: { page_id: string }) =>
          page_id === "nocover"
            ? {}
            : { cover: { type: "external", external: { url: "https://example.com/x.jpg" } } }
        ),
      },
    };
  }),
}));

vi.mock("sharp", () => ({
  default: vi.fn(() => ({
    rotate: () => ({
      resize: () => ({
        webp: () => ({
          toBuffer: async () => Buffer.from("x"),
        }),
      }),
    }),
  })),
}));

vi.stubGlobal(
  "fetch",
  vi.fn(async () => ({
    ok: true,
    arrayBuffer: async () => new TextEncoder().encode("x").buffer,
    headers: { get: () => "image/jpeg" },
  }))
);

describe("/api/notion-cover Cache-Control (260723-g2q Task 1)", () => {
  it("success response has the exact long-lived Cache-Control string", async () => {
    const { GET } = await import("@/app/api/notion-cover/route");
    const res = await GET(
      new NextRequest("http://localhost:3000/api/notion-cover?pageId=abc123")
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe(EXPECTED_CACHE_CONTROL);
  });

  it("error response (no cover -> 404) has no Cache-Control header", async () => {
    const { GET } = await import("@/app/api/notion-cover/route");
    const res = await GET(
      new NextRequest("http://localhost:3000/api/notion-cover?pageId=nocover")
    );
    expect(res.status).toBe(404);
    expect(res.headers.get("Cache-Control")).toBeNull();
  });
});
