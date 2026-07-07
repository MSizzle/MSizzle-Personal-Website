import { describe, it, expect, vi, afterEach } from "vitest";
import { needsEnrichment, type Row } from "@/lib/enrich";
import { bookLookup } from "@/lib/enrich/book";

function makeRow(overrides: Partial<Row> = {}): Row {
  return {
    id: "p1",
    title: "Dune",
    type: "Book",
    subtitle: "",
    note: "",
    url: "",
    published: false,
    hasCover: false,
    ...overrides,
  };
}

describe("needsEnrichment", () => {
  it("is true when unpublished, named, typed, and missing a cover", () => {
    expect(needsEnrichment(makeRow())).toBe(true);
  });

  it("is true when it has a cover but no subtitle", () => {
    expect(needsEnrichment(makeRow({ hasCover: true, subtitle: "" }))).toBe(true);
  });

  it("is false once published (never touch published rows)", () => {
    expect(needsEnrichment(makeRow({ published: true }))).toBe(false);
  });

  it("is false when the Type is unset/unrecognized", () => {
    expect(needsEnrichment(makeRow({ type: null }))).toBe(false);
  });

  it("is false when it already has both a cover and a subtitle", () => {
    expect(
      needsEnrichment(makeRow({ hasCover: true, subtitle: "Frank Herbert" }))
    ).toBe(false);
  });

  it("is false when the name is blank", () => {
    expect(needsEnrichment(makeRow({ title: "   " }))).toBe(false);
  });
});

describe("bookLookup", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("maps a Google Books volume to cover + author + url, https-upgrading the thumbnail", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          items: [
            {
              volumeInfo: {
                title: "Dune",
                authors: ["Frank Herbert"],
                description: "A desert planet epic.",
                infoLink: "https://books.google.com/dune",
                imageLinks: {
                  thumbnail: "http://books.google.com/img?id=1&edge=curl",
                },
              },
            },
          ],
        }),
      }))
    );

    const result = await bookLookup({ title: "Dune", type: "Book" });

    expect(result).not.toBeNull();
    expect(result!.subtitle).toBe("Frank Herbert");
    expect(result!.url).toBe("https://books.google.com/dune");
    expect(result!.coverUrl).toBe("https://books.google.com/img?id=1");
    expect(result!.context).toBe("A desert planet epic.");
  });

  it("falls back to Open Library when Google Books is rate-limited", async () => {
    const fetchMock = vi
      .fn()
      // First call: Google Books returns 429.
      .mockResolvedValueOnce({ ok: false, status: 429, json: async () => ({}) })
      // Retry inside fetchRetry also 429s (keeps it deterministic).
      .mockResolvedValueOnce({ ok: false, status: 429, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: false, status: 429, json: async () => ({}) })
      // Then Open Library succeeds.
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          docs: [
            {
              title: "Dune",
              author_name: ["Frank Herbert"],
              cover_i: 42,
              key: "/works/OL1W",
            },
          ],
        }),
      });
    vi.stubGlobal("fetch", fetchMock);

    const result = await bookLookup({ title: "Dune", type: "Book" });

    expect(result).not.toBeNull();
    expect(result!.subtitle).toBe("Frank Herbert");
    expect(result!.coverUrl).toBe("https://covers.openlibrary.org/b/id/42-L.jpg");
    expect(result!.url).toBe("https://openlibrary.org/works/OL1W");
  });
});
