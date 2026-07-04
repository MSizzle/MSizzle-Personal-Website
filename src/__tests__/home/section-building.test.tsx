import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

// Mock RailBox: render num and label as data attributes for assertion
vi.mock("@/components/home/rail-box", () => ({
  RailBox: function RailBoxMock({ num, label }: { num: string; label: string }) {
    return React.createElement(
      "div",
      { "data-testid": "rail-box", "data-num": num, "data-label": label },
      React.createElement("div", { "data-testid": "rail-num" }, num),
      React.createElement("div", { "data-testid": "rail-label" }, label)
    );
  },
}));

// Mock Photo: render a div with data-testid for photo container assertion
vi.mock("@/components/home/photo", () => ({
  Photo: function PhotoMock({
    dark,
    aspectRatio,
    caption,
  }: {
    dark?: boolean;
    aspectRatio?: string;
    caption?: string;
  }) {
    return React.createElement("div", {
      "data-testid": "photo",
      "data-dark": dark ? "true" : "false",
      "data-aspect": aspectRatio,
      "data-caption": caption,
    });
  },
}));

afterEach(() => {
  cleanup();
});

describe("SectionBuilding (17.4-06)", () => {
  it("renders RailBox with num 01 and label Building", async () => {
    const { SectionBuilding } = await import("@/components/home/section-building");
    render(React.createElement(SectionBuilding));

    const railBox = screen.getByTestId("rail-box");
    expect(railBox).toBeDefined();
    expect(railBox.getAttribute("data-num")).toBe("01");
    expect(railBox.getAttribute("data-label")).toBe("Building");
  });

  it("renders the rail index 01", async () => {
    const { SectionBuilding } = await import("@/components/home/section-building");
    render(React.createElement(SectionBuilding));
    expect(screen.getByTestId("rail-num").textContent).toBe("01");
  });

  it("renders the rail label Building", async () => {
    const { SectionBuilding } = await import("@/components/home/section-building");
    render(React.createElement(SectionBuilding));
    expect(screen.getByTestId("rail-label").textContent).toBe("Building");
  });

  it("renders a slide-in photo container with from-left class", async () => {
    const { SectionBuilding } = await import("@/components/home/section-building");
    const { container } = render(React.createElement(SectionBuilding));

    // The photo is wrapped in a div with classes "shadowed slide from-left"
    const slideContainer = container.querySelector(".shadowed.slide.from-left");
    expect(slideContainer).toBeDefined();
    expect(slideContainer).not.toBeNull();
  });

  it("renders a dark photo for the dark band", async () => {
    const { SectionBuilding } = await import("@/components/home/section-building");
    render(React.createElement(SectionBuilding));

    const photo = screen.getByTestId("photo");
    expect(photo.getAttribute("data-dark")).toBe("true");
  });

  it("does not render BigList Building/Writing/Doing", async () => {
    const { SectionBuilding } = await import("@/components/home/section-building");
    render(React.createElement(SectionBuilding));

    // The old structure asserted BigList with labels Building/Writing/Doing.
    // The new structure uses RailBox; no big-list should be present.
    expect(screen.queryByTestId("big-list")).toBeNull();
    // "Doing" was an old BigList item that no longer exists in the reskinned component
    expect(screen.queryByText(/^Doing$/i)).toBeNull();
  });
});
