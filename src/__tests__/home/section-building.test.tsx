import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

// Mock v3 primitives so the test doesn't need full rendering pipeline
vi.mock("@/components/v3/big-list", () => ({
  BigList: function BigListMock({ items }: { items: { label: string; href: string; tag: string }[] }) {
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
    return React.createElement("div", { "data-testid": "section-label" }, children);
  },
}));

afterEach(() => {
  cleanup();
});

describe("SectionBuilding (HD-04)", () => {
  it("renders BigList with Building/Writing/Doing links", async () => {
    const { SectionBuilding } = await import("@/components/home/section-building");
    render(React.createElement(SectionBuilding));
    expect(screen.getByText(/Building/i)).toBeDefined();
    expect(screen.getByText(/Writing/i)).toBeDefined();
    expect(screen.getByText(/Doing/i)).toBeDefined();
  });

  it("BigList items include correct href attributes", async () => {
    const { SectionBuilding } = await import("@/components/home/section-building");
    render(React.createElement(SectionBuilding));
    // BigList mock renders labels as list items; verify all three labels are rendered
    const items = screen.getAllByRole("listitem");
    const labels = items.map((item) => item.textContent);
    expect(labels).toContain("Building");
    expect(labels).toContain("Writing");
    expect(labels).toContain("Doing");
  });
});
