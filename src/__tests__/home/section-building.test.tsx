import { describe, it, expect, vi } from "vitest";

// Mock v3 primitives so the test doesn't need full rendering pipeline
vi.mock("@/components/v3/big-list", () => ({
  BigList: function BigListMock({ items }: { items: { label: string; href: string; tag: string }[] }) {
    const React = require("react");
    return React.createElement(
      "ul",
      { "data-testid": "big-list" },
      items.map((item: { label: string }) =>
        React.createElement("li", { key: item.label }, item.label)
      )
    );
  },
}));

vi.mock("@/components/v3/section-label", () => ({
  SectionLabel: function SectionLabelMock({ children }: { children: React.ReactNode }) {
    const React = require("react");
    return React.createElement("div", { "data-testid": "section-label" }, children);
  },
}));

// Stub the real component (does not exist yet — created in Plan 15-03)
vi.mock("@/components/home/section-building", () => ({
  SectionBuilding: function SectionBuildingStub() {
    return null;
  },
}));

describe("SectionBuilding (HD-04)", () => {
  it("stub is importable before real component exists", async () => {
    const { SectionBuilding } = await import(
      "@/components/home/section-building"
    );
    expect(SectionBuilding).toBeDefined();
  });

  // Will be promoted to real tests in Plan 15-03 Task 1
  it.todo(
    "renders BigList with Building/Writing/Doing links — wire to real component"
  );
  it.todo(
    "BigList items have correct href attributes — wire to real component"
  );
});
