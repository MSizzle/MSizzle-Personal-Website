/**
 * Test scaffold for UsesList component — owned by Plan 05 (16-05).
 *
 * Wave 0 tests verify the component renders correctly with USES_DATA
 * from the Plan 01 data module. Downstream integration tests are deferred
 * to Plan 05 with it.todo().
 */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { UsesList } from "@/components/v3/uses-list";
import { USES_DATA } from "@/lib/uses";

beforeEach(() => {
  cleanup();
});

describe("UsesList component (Plan 05 / PG-02)", () => {
  it("renders all group headings from USES_DATA", () => {
    render(<UsesList groups={USES_DATA} />);
    expect(screen.getByText("AI & Development")).toBeDefined();
    expect(screen.getByText("Productivity")).toBeDefined();
    expect(screen.getByText("Communication")).toBeDefined();
    expect(screen.getByText("Hardware")).toBeDefined();
  });

  it("renders Hardware group items with TODO: placeholder text", () => {
    const hardwareGroup = USES_DATA.find((g) => g.heading === "Hardware");
    expect(hardwareGroup).toBeDefined();
    // All Hardware items should have TODO: prefix per D-06
    hardwareGroup!.items.forEach((item) => {
      expect(item.detail.startsWith("TODO:")).toBe(true);
    });
  });

  it("renders at least one Hardware item's detail text in the component", () => {
    render(<UsesList groups={USES_DATA} />);
    const hardwareGroup = USES_DATA.find((g) => g.heading === "Hardware");
    // Find the first Hardware item detail and assert it appears
    const firstDetail = hardwareGroup!.items[0].detail;
    expect(screen.getAllByText(firstDetail).length).toBeGreaterThanOrEqual(1);
  });

  it("USES_DATA has exactly 4 groups", () => {
    expect(USES_DATA.length).toBe(4);
  });

  it("USES_DATA[3].heading is Hardware", () => {
    expect(USES_DATA[3].heading).toBe("Hardware");
  });

  it.todo("UsesList renders with custom groups (Plan 05)");
  it.todo("UsesList dt/dd grid collapses below 600px (Plan 05)");
});
