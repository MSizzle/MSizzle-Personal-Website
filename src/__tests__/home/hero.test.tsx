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
    expect(headings[0].textContent).toBe(
      "Blessed are those who create order from chaos."
    );
  });

  it("renders the subtitle with the exact copy", () => {
    render(React.createElement(Hero));
    expect(
      screen.getByText(
        "Founder of Prometheus, an applied AI company. I love technology, biology, and self-improvement. If you like these as well, we’ll get along."
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

  it("wraps each brand mark in a drop-box whose logo links out to the site", () => {
    const { container } = render(React.createElement(Hero));

    const drops = container.querySelectorAll(".drop");
    expect(drops).toHaveLength(2);

    const [prometheus, monthly] = [...drops];

    // The label sits in the box; the mark is the link released on hover.
    expect(prometheus.querySelector(".drop-label")?.textContent).toBe(
      "Building Prometheus"
    );
    expect(monthly.querySelector(".drop-label")?.textContent).toBe(
      "Monty Monthly"
    );

    const promLink = prometheus.querySelector("a.drop-logo");
    expect(promLink?.getAttribute("href")).toBe("https://prometheus.today");
    expect(promLink?.getAttribute("target")).toBe("_blank");
    expect(promLink?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(promLink?.querySelector("img")).not.toBeNull();

    const mmLink = monthly.querySelector("a.drop-logo");
    expect(mmLink?.getAttribute("href")).toBe(
      "https://montymonthly.substack.com"
    );
    expect(mmLink?.getAttribute("target")).toBe("_blank");
    expect(mmLink?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(mmLink?.querySelector("img")).not.toBeNull();
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
