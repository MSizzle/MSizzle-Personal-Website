/**
 * Tests for TitleCard component — Phase 19 typographic title-card face (SC-1).
 * Plan 19-01 TDD RED gate.
 *
 * Asserts:
 * (1) renders title text
 * (2) renders kicker with class title-card-kicker
 * (3) renders dek when provided, omits when undefined
 * (4) root has class title-card; ink field adds title-card--ink; paper field does not
 * (5) aspectRatio prop sets inline style
 * (6) no img element (pure typographic face)
 */
import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

describe("TitleCard component (Plan 19-01)", () => {
  it("renders the title text", async () => {
    const { TitleCard } = await import("@/components/v3/title-card");
    render(React.createElement(TitleCard, { title: "My Project Title" }));
    expect(screen.getByText("My Project Title")).toBeDefined();
  });

  it("renders kicker text when provided and kicker element has class title-card-kicker", async () => {
    const { TitleCard } = await import("@/components/v3/title-card");
    const { container } = render(
      React.createElement(TitleCard, { title: "Title", kicker: "2024" })
    );
    expect(screen.getByText("2024")).toBeDefined();
    const kickerEl = container.querySelector(".title-card-kicker");
    expect(kickerEl).toBeDefined();
    expect(kickerEl?.textContent).toBe("2024");
  });

  it("renders dek text when provided; omits dek element when dek is undefined", async () => {
    const { TitleCard } = await import("@/components/v3/title-card");
    // With dek
    const { container: withDek } = render(
      React.createElement(TitleCard, { title: "Title", dek: "A short description" })
    );
    expect(screen.getByText("A short description")).toBeDefined();
    cleanup();

    // Without dek — no .title-card-dek element
    const { container: withoutDek } = render(
      React.createElement(TitleCard, { title: "No Dek" })
    );
    const dekEl = withoutDek.querySelector(".title-card-dek");
    expect(dekEl).toBeNull();
  });

  it("root element has class title-card; field=ink adds title-card--ink; no field omits title-card--ink", async () => {
    const { TitleCard } = await import("@/components/v3/title-card");

    // Default (no field)
    const { container: defaultContainer } = render(
      React.createElement(TitleCard, { title: "Default Field" })
    );
    const rootDefault = defaultContainer.firstElementChild;
    expect(rootDefault?.classList.contains("title-card")).toBe(true);
    expect(rootDefault?.classList.contains("title-card--ink")).toBe(false);
    cleanup();

    // field="ink"
    const { container: inkContainer } = render(
      React.createElement(TitleCard, { title: "Ink Field", field: "ink" })
    );
    const rootInk = inkContainer.firstElementChild;
    expect(rootInk?.classList.contains("title-card")).toBe(true);
    expect(rootInk?.classList.contains("title-card--ink")).toBe(true);
  });

  it("sets aspect-ratio in inline style when aspectRatio prop is passed", async () => {
    const { TitleCard } = await import("@/components/v3/title-card");
    const { container } = render(
      React.createElement(TitleCard, { title: "Aspect Test", aspectRatio: "3/2.2" })
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root?.style?.aspectRatio).toBe("3/2.2");
  });

  it("renders no img element (pure typographic face)", async () => {
    const { TitleCard } = await import("@/components/v3/title-card");
    const { container } = render(
      React.createElement(TitleCard, {
        title: "No Image",
        kicker: "Category",
        dek: "Some dek text",
      })
    );
    const img = container.querySelector("img");
    expect(img).toBeNull();
  });
});
