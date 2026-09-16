/**
 * Test suite for SiteHeader — the single sticky header rendered on every
 * route (quick task 260916-lqq), unifying the four divergent nav bars and
 * the pathname/scroll gating that previously hid nav at various points.
 *
 * Harness reused from the deleted navigation.test.tsx: mock next/link, mock
 * next/navigation's usePathname via a module-level factory, and a setScrollY
 * helper paired with a dispatched scroll event under act().
 */
import React, { act } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

beforeEach(() => {
  cleanup();
});

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", {
    value,
    writable: true,
    configurable: true,
  });
}

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Module-level mock factory — usePathname return value is overridden per test
const mockUsePathname = vi.fn().mockReturnValue("/");
vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

import { SiteHeader } from "@/components/nav/site-header";

describe("SiteHeader (quick task 260916-lqq)", () => {
  it("renders a <header class=\"site-header\"> on /", () => {
    mockUsePathname.mockReturnValue("/");
    const { container } = render(<SiteHeader />);
    expect(container.querySelector("header.site-header")).not.toBeNull();
  });

  it("renders a <header class=\"site-header\"> on /writing", () => {
    mockUsePathname.mockReturnValue("/writing");
    const { container } = render(<SiteHeader />);
    expect(container.querySelector("header.site-header")).not.toBeNull();
  });

  it("renders a <header class=\"site-header\"> on /blog/some-post", () => {
    mockUsePathname.mockReturnValue("/blog/some-post");
    const { container } = render(<SiteHeader />);
    expect(container.querySelector("header.site-header")).not.toBeNull();
  });

  it("has no is-solid class at scrollY 0", () => {
    mockUsePathname.mockReturnValue("/");
    setScrollY(0);
    const { container } = render(<SiteHeader />);
    const header = container.querySelector("header");
    expect(header?.classList.contains("is-solid")).toBe(false);
  });

  it("gains is-solid after a scroll event at scrollY 40", () => {
    mockUsePathname.mockReturnValue("/");
    setScrollY(0);
    const { container } = render(<SiteHeader />);
    setScrollY(40);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    const header = container.querySelector("header");
    expect(header?.classList.contains("is-solid")).toBe(true);
  });

  it("keeps is-solid at scrollY 20 once solid (above the 8px exit)", () => {
    mockUsePathname.mockReturnValue("/");
    setScrollY(0);
    const { container } = render(<SiteHeader />);
    setScrollY(40);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    setScrollY(20);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    const header = container.querySelector("header");
    expect(header?.classList.contains("is-solid")).toBe(true);
  });

  it("drops is-solid at scrollY 0 once solid", () => {
    mockUsePathname.mockReturnValue("/");
    setScrollY(0);
    const { container } = render(<SiteHeader />);
    setScrollY(40);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    setScrollY(0);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    const header = container.querySelector("header");
    expect(header?.classList.contains("is-solid")).toBe(false);
  });

  it("desktop nav renders exactly 4 links in order", () => {
    mockUsePathname.mockReturnValue("/");
    render(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    const links = nav.querySelectorAll("a");
    expect(links.length).toBe(4);
    expect(Array.from(links).map((a) => a.getAttribute("href"))).toEqual([
      "https://prometheus.today",
      "/building",
      "/writing",
      "/contact",
    ]);
  });

  it("Prometheus link carries target=_blank and rel containing noopener, no /prometheus path", () => {
    mockUsePathname.mockReturnValue("/");
    render(<SiteHeader />);
    expect(document.querySelector('a[href="/prometheus"]')).toBeNull();
    const external = document.querySelector('a[href="https://prometheus.today"]');
    expect(external).not.toBeNull();
    expect(external?.getAttribute("target")).toBe("_blank");
    expect(external?.getAttribute("rel")).toContain("noopener");
  });

  it("marks Building active on /building", () => {
    mockUsePathname.mockReturnValue("/building");
    render(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    const building = nav.querySelector('a[href="/building"]');
    expect(building?.classList.contains("nav-cell--active")).toBe(true);
  });

  it("marks Writing active on /writing and on /blog/anything", () => {
    mockUsePathname.mockReturnValue("/writing");
    const { unmount } = render(<SiteHeader />);
    let nav = screen.getByRole("navigation", { name: "Primary" });
    expect(
      nav.querySelector('a[href="/writing"]')?.classList.contains("nav-cell--active")
    ).toBe(true);
    unmount();

    mockUsePathname.mockReturnValue("/blog/anything");
    render(<SiteHeader />);
    nav = screen.getByRole("navigation", { name: "Primary" });
    expect(
      nav.querySelector('a[href="/writing"]')?.classList.contains("nav-cell--active")
    ).toBe(true);
  });

  it("marks Contact active on /contact", () => {
    mockUsePathname.mockReturnValue("/contact");
    render(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    const contact = nav.querySelector('a[href="/contact"]');
    expect(contact?.classList.contains("nav-cell--active")).toBe(true);
  });

  it("marks no link active on /", () => {
    mockUsePathname.mockReturnValue("/");
    render(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(nav.querySelectorAll(".nav-cell--active").length).toBe(0);
  });

  it("hamburger exposes aria-label and aria-expanded, toggling on click", () => {
    mockUsePathname.mockReturnValue("/");
    render(<SiteHeader />);
    const hamburger = screen.getByRole("button", { name: /open navigation menu/i });
    expect(hamburger.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(hamburger);
    const closeButton = screen.getByRole("button", { name: /close navigation menu/i });
    expect(closeButton.getAttribute("aria-expanded")).toBe("true");
  });

  it("clicking the hamburger opens a drawer containing a[href=/building]", () => {
    mockUsePathname.mockReturnValue("/");
    render(<SiteHeader />);
    const hamburger = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(hamburger);
    const buildingLink = document.querySelector('a[href="/building"]');
    expect(buildingLink).not.toBeNull();
  });
});
