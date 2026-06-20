/**
 * Test scaffold for /projects page — owned by Plan 04 (16-04).
 *
 * Wave 0 tests verify:
 * (a) WATCHING_ITEMS from Plan 01 data module has correct shape (length === 6)
 * (b) Empty-state "No projects yet" copy stub (deferred — page not yet updated)
 *
 * Integration tests for the token-repainted ProjectsPage are deferred to Plan 04.
 */
import { describe, it, expect } from "vitest";
import { WATCHING_ITEMS } from "@/lib/watching";

describe("/projects page (Plan 04 / PG-03)", () => {
  // Plan 01 data module shape verification
  it("WATCHING_ITEMS from @/lib/watching has length 6 (Plan 01 deliverable)", () => {
    expect(WATCHING_ITEMS.length).toBe(6);
  });

  it("every WatchingItem has non-empty id, title, channel, url fields", () => {
    WATCHING_ITEMS.forEach((item) => {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.channel.length).toBeGreaterThan(0);
      expect(item.url.length).toBeGreaterThan(0);
    });
  });

  it("every WatchingItem url matches the YouTube watch URL pattern for its id", () => {
    WATCHING_ITEMS.forEach((item) => {
      expect(item.url).toBe(
        `https://www.youtube.com/watch?v=${item.id}`
      );
    });
  });

  it.todo(
    'projects page renders empty-state "No projects yet" when projects is empty (Plan 04)'
  );
  it.todo(
    "projects page renders YearBlock groups for projects (Plan 04)"
  );
  it.todo(
    "projects page tokens use Pumpkin Amber vars --color-text, --color-text-muted (Plan 04)"
  );
  it.todo(
    "projects page revalidate is 1800 (Plan 04)"
  );
});
