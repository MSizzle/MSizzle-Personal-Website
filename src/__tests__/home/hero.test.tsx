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

  it("renders zero img/next-image nodes", () => {
    const { container } = render(React.createElement(Hero));
    expect(container.querySelectorAll("img").length).toBe(0);
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
