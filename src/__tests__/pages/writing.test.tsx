/**
 * Test scaffold for /writing page — owned by Plan 04 (16-04).
 *
 * Wave 0 tests verify:
 * (a) USES_DATA from Plan 01 data module has correct shape (length === 4)
 * (b) Empty-state "No essays yet" copy stub (deferred — page not yet updated)
 *
 * Integration tests for the token-repainted WritingPage are deferred to Plan 04.
 */
import { describe, it, expect } from "vitest";
import { USES_DATA } from "@/lib/uses";

describe("/writing page (Plan 04 / PG-01)", () => {
  // Plan 01 data module shape verification
  it("USES_DATA from @/lib/uses has length 4 (Plan 01 deliverable)", () => {
    expect(USES_DATA.length).toBe(4);
  });

  it("USES_DATA has expected group headings", () => {
    const headings = USES_DATA.map((g) => g.heading);
    expect(headings).toContain("AI & Development");
    expect(headings).toContain("Productivity");
    expect(headings).toContain("Communication");
    expect(headings).toContain("Hardware");
  });

  it("USES_DATA Hardware group items all have TODO: placeholder details", () => {
    const hardware = USES_DATA.find((g) => g.heading === "Hardware");
    expect(hardware).toBeDefined();
    hardware!.items.forEach((item) => {
      expect(item.detail.startsWith("TODO:")).toBe(true);
    });
  });

  it.todo(
    'writing page renders empty-state "No essays yet" when posts is empty (Plan 04)'
  );
  it.todo(
    "writing page renders YearBlock groups for posts (Plan 04)"
  );
  it.todo(
    "writing page tokens use Pumpkin Amber vars --color-text, --color-text-muted (Plan 04)"
  );
  it.todo(
    "writing page revalidate is 1800 (Plan 04)"
  );
});
