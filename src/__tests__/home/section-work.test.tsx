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

afterEach(() => {
  cleanup();
});

describe("SectionWork title-card faces (Phase 19 / 19-02)", () => {
  it("renders project titles as visible text in the work grid", async () => {
    const { SectionWork } = await import("@/components/home/section-work");
    const projects = [
      {
        id: "p1",
        slug: "ai-assistant",
        title: "AI Assistant",
        description: "An AI product",
        cover: null,
        image: null,
        emoji: null,
        externalUrl: "",
        tags: ["AI"],
        featured: true,
        published: true,
        lastEdited: "2025-04-01",
      },
      {
        id: "p2",
        slug: "design-tool",
        title: "Design Tool",
        description: "",
        cover: null,
        image: null,
        emoji: null,
        externalUrl: "",
        tags: ["Design"],
        featured: false,
        published: true,
        lastEdited: "2025-06-15",
      },
    ];
    render(React.createElement(SectionWork, { projects } as any));
    expect(screen.getByText("AI Assistant")).toBeDefined();
    expect(screen.getByText("Design Tool")).toBeDefined();
  });

  it("renders dek text when project has a description", async () => {
    const { SectionWork } = await import("@/components/home/section-work");
    const projects = [
      {
        id: "p3",
        slug: "product",
        title: "My Product",
        description: "An AI product",
        cover: null,
        image: null,
        emoji: null,
        externalUrl: "",
        tags: [],
        featured: false,
        published: true,
        lastEdited: "2025-01-01",
      },
    ];
    render(React.createElement(SectionWork, { projects } as any));
    expect(screen.getByText("An AI product")).toBeDefined();
  });

  it("does not render notion-cover images even when project has a non-null cover", async () => {
    const { SectionWork } = await import("@/components/home/section-work");
    const projects = [
      {
        id: "p4",
        slug: "covered",
        title: "Covered Project",
        description: "",
        cover: "https://notion.so/cover.jpg",
        image: null,
        emoji: null,
        externalUrl: "",
        tags: [],
        featured: false,
        published: true,
        lastEdited: "2025-01-01",
      },
    ];
    render(React.createElement(SectionWork, { projects } as any));
    const allImgs = document.querySelectorAll("img");
    const coverImg = Array.from(allImgs).find((img) =>
      img.getAttribute("src")?.includes("notion-cover")
    );
    expect(coverImg).toBeUndefined();
  });

  it("renders four title-card elements when no projects are provided", async () => {
    const { SectionWork } = await import("@/components/home/section-work");
    render(React.createElement(SectionWork));
    const titleCards = document.querySelectorAll(".title-card");
    expect(titleCards.length).toBe(4);
  });
});

describe("SectionWork (Phase 17.3 SC-2)", () => {
  it("SC-2.1: renders a link to /building", async () => {
    const { SectionWork } = await import("@/components/home/section-work");
    render(React.createElement(SectionWork));
    const allLinks = screen.getAllByRole("link");
    expect(allLinks.some((l) => l.getAttribute("href") === "/building")).toBe(true);
  });

  it("D-01: does NOT render any link to /portfolio", async () => {
    const { SectionWork } = await import("@/components/home/section-work");
    render(React.createElement(SectionWork));
    const allLinks = screen.getAllByRole("link");
    expect(allLinks.every((l) => l.getAttribute("href") !== "/portfolio")).toBe(true);
  });

  it("SC-2.2: building link displays text Projects", async () => {
    const { SectionWork } = await import("@/components/home/section-work");
    render(React.createElement(SectionWork));
    const projectsLink = screen
      .getAllByRole("link")
      .find((l) => l.getAttribute("href") === "/building");
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
