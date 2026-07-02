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

// Mock SectionLabel: renders children in a div
vi.mock("@/components/v3/section-label", () => ({
  SectionLabel: function SectionLabelMock({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return React.createElement("div", { "data-testid": "section-label" }, children);
  },
}));

// Mock Button: renders children in an <a> so href is assertable via getAllByRole("link")
vi.mock("@/components/v3/button", () => ({
  Button: function ButtonMock({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href?: string;
    [key: string]: unknown;
  }) {
    return React.createElement("a", { href, ...props }, children);
  },
}));

// Mock cn utility: join truthy class names
vi.mock("@/utils/cn", () => ({
  cn: (...args: unknown[]) =>
    (args as (string | false | null | undefined)[])
      .filter(Boolean)
      .join(" "),
}));

afterEach(() => {
  cleanup();
});

describe("SectionWork (Phase 17.3 SC-2)", () => {
  it("SC-2.1: renders a link to /portfolio", async () => {
    const { SectionWork } = await import("@/components/home/section-work");
    render(React.createElement(SectionWork));
    const allLinks = screen.getAllByRole("link");
    expect(allLinks.some((l) => l.getAttribute("href") === "/portfolio")).toBe(true);
  });

  it("D-01: does NOT render any link to /projects", async () => {
    const { SectionWork } = await import("@/components/home/section-work");
    render(React.createElement(SectionWork));
    const allLinks = screen.getAllByRole("link");
    expect(allLinks.every((l) => l.getAttribute("href") !== "/projects")).toBe(true);
  });

  it("SC-2.2: portfolio link displays text Portfolio", async () => {
    const { SectionWork } = await import("@/components/home/section-work");
    render(React.createElement(SectionWork));
    const portfolioLink = screen
      .getAllByRole("link")
      .find((l) => l.getAttribute("href") === "/portfolio");
    expect(portfolioLink).toBeDefined();
    expect(portfolioLink!.textContent).toContain("Portfolio");
  });

  it("SC-2.2: portfolio section contains kicker SELECTED", async () => {
    const { SectionWork } = await import("@/components/home/section-work");
    render(React.createElement(SectionWork));
    // Use exact string match -- /SELECTED/i would also hit "Selected Work" in SectionLabel
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
