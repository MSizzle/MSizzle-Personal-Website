import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Hero } from "@/components/home/hero";

afterEach(() => cleanup());

describe("Hero", () => {
  it("renders exactly one H1 with the exact copy", () => {
    render(React.createElement(Hero));
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings.length).toBe(1);
    expect(headings[0].textContent).toBe("I build things and write about it.");
  });

  it("renders the subtitle with the exact copy", () => {
    render(React.createElement(Hero));
    expect(
      screen.getByText(
        "Right now that mostly means Prometheus, an AI integrations and education company. Everything else here is the residue: past projects, monthly essays, and a running list of things I like."
      )
    ).toBeDefined();
  });

  it("renders a mono eyebrow with 'Monty Singer'", () => {
    render(React.createElement(Hero));
    expect(screen.getByText("Monty Singer")).toBeDefined();
  });

  it("renders the 3-cell meta row: Currently, Writes, Elsewhere", () => {
    render(React.createElement(Hero));
    expect(screen.getByText("Currently")).toBeDefined();
    expect(screen.getByText("Building Prometheus")).toBeDefined();
    expect(screen.getByText("Writes")).toBeDefined();
    expect(screen.getByText("Monty Monthly")).toBeDefined();
    expect(screen.getByText("Elsewhere")).toBeDefined();
  });

  it("renders the three Elsewhere links resolving to the exact hrefs with safe rel/target", () => {
    render(React.createElement(Hero));

    const x = screen.getByRole("link", { name: "X" });
    expect(x.getAttribute("href")).toBe("https://x.com/themontysinger");
    expect(x.getAttribute("target")).toBe("_blank");
    expect(x.getAttribute("rel")).toContain("noopener");
    expect(x.getAttribute("rel")).toContain("noreferrer");

    const linkedin = screen.getByRole("link", { name: "LinkedIn" });
    expect(linkedin.getAttribute("href")).toBe("https://linkedin.com/in/monty-singer");
    expect(linkedin.getAttribute("target")).toBe("_blank");
    expect(linkedin.getAttribute("rel")).toContain("noopener");
    expect(linkedin.getAttribute("rel")).toContain("noreferrer");

    const email = screen.getByRole("link", { name: "Email" });
    expect(email.getAttribute("href")).toBe("mailto:monty@prometheus.today");
    expect(email.getAttribute("target")).toBeNull();
  });

  it("renders no photography — only the two brand marks in the meta row", () => {
    const { container } = render(React.createElement(Hero));
    const imgs = [...container.querySelectorAll("img")];

    // HP-01 forbids a photograph in the hero. Brand logos are a deliberate,
    // Monty-approved exception and render in their real colors.
    // next/image rewrites src through /_next/image?url=<encoded>, so match on
    // the encoded logo path rather than the raw one.
    const allowed = [
      "logos%2Fprometheus-mark.png",
      "logos%2Fmonty-monthly.png",
    ];
    expect(imgs).toHaveLength(2);
    imgs.forEach((img) => {
      const src = img.getAttribute("src") ?? "";
      expect(allowed.some((path) => src.includes(path))).toBe(true);
    });

    // No portrait/photo source may appear.
    imgs.forEach((img) => {
      expect(img.getAttribute("src")).not.toMatch(
        /\/home\/|MSizzle-website-photos|\.jpe?g$/i
      );
    });
  });

  it("renders none of the deleted photo/motion classes", () => {
    const { container } = render(React.createElement(Hero));
    const deletedClasses = [
      "pcarousel",
      "pslide",
      "statustag",
      "hero-ticker",
      "tick-link",
      "tick-sep",
      "sig",
      "hl",
      "hw",
      "wayin",
      "subtitle",
    ];
    for (const cls of deletedClasses) {
      expect(container.querySelectorAll(`.${cls}`).length).toBe(0);
    }
  });
});
