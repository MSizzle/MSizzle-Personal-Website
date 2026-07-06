import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

// Mock next/link: forward href so getAllByRole("link") can assert href values
vi.mock("next/link", () => ({
  default: function LinkMock({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return React.createElement("a", { href, ...props }, children);
  },
}));

// Mock RailBox: renders num and label so the component can mount
vi.mock("@/components/home/rail-box", () => ({
  RailBox: function RailBoxMock({ num, label }: { num: string; label: string }) {
    return React.createElement(
      "div",
      { "data-testid": "rail-box", "data-num": num },
      label
    );
  },
}));

// Mock Photo: renders a div so the component can mount without canvas/image setup
vi.mock("@/components/home/photo", () => ({
  Photo: function PhotoMock({
    caption,
    aspectRatio,
  }: {
    caption?: string;
    aspectRatio?: string;
  }) {
    return React.createElement("div", {
      "data-testid": "photo",
      "data-caption": caption,
      "data-aspect": aspectRatio,
    });
  },
}));

afterEach(() => {
  cleanup();
});

describe("SectionWork (Phase 17.3 SC-2)", () => {
  it("SC-2.1: renders a link to /projects", async () => {
    const { SectionWork } = await import("@/components/home/section-work");
    render(React.createElement(SectionWork));
    const allLinks = screen.getAllByRole("link");
    expect(allLinks.some((l) => l.getAttribute("href") === "/projects")).toBe(true);
  });

  it("D-01: does NOT render any link to /portfolio", async () => {
    const { SectionWork } = await import("@/components/home/section-work");
    render(React.createElement(SectionWork));
    const allLinks = screen.getAllByRole("link");
    expect(allLinks.every((l) => l.getAttribute("href") !== "/portfolio")).toBe(true);
  });

  it("SC-2.2: projects link displays text Projects", async () => {
    const { SectionWork } = await import("@/components/home/section-work");
    render(React.createElement(SectionWork));
    const projectsLink = screen
      .getAllByRole("link")
      .find((l) => l.getAttribute("href") === "/projects");
    expect(projectsLink).toBeDefined();
    expect(projectsLink!.textContent).toContain("Projects");
  });

  it("SC-2.2: portfolio section contains kicker SELECTED", async () => {
    const { SectionWork } = await import("@/components/home/section-work");
    render(React.createElement(SectionWork));
    // Use exact string match -- /SELECTED/i would also hit "Selected work" in RailBox
    expect(screen.getByText("SELECTED")).toBeDefined();
  });

  it("T-17.1-02 preservation: Prometheus external link retains rel=noopener noreferrer", async () => {
    const { SectionWork } = await import("@/components/home/section-work");
    render(React.createElement(SectionWork));
    const prometheusLink = screen
      .getAllByRole("link")
      .find((l) => l.getAttribute("href") === "https://prometheus.today");
    expect(prometheusLink).toBeDefined();
    const rel = prometheusLink!.getAttribute("rel") ?? "";
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
  });
});
