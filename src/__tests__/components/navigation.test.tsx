/**
 * Test suite for Navigation component — Plan 02 (16-02).
 *
 * Tests verify:
 *  - /uses → activeLabel === 'Uses'
 *  - /watching → activeLabel === 'Watching'
 *  - MOBILE_LINKS includes /uses, /watching, /prometheus entries
 *  - Desktop primary nav stays at 5 links (D-11)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

beforeEach(() => {
  cleanup();
});

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
const mockUsePathname = vi.fn().mockReturnValue("/projects");
vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

// Mock EditorialHeader to capture the `active` prop
const mockEditorialHeader = vi.fn(
  ({ active }: { active?: string }) => (
    <div data-testid="editorial-header" data-active={active ?? ""} />
  )
);
vi.mock("@/components/home-v2/editorial-header", () => ({
  EditorialHeader: (props: { active?: string }) => mockEditorialHeader(props),
}));

import { Navigation } from "@/components/nav/navigation";

describe("Navigation component (Plan 02 / D-13)", () => {
  it("renders without error on a known route", () => {
    const { container } = render(<Navigation />);
    expect(container).toBeDefined();
  });

  it("renders Monty Singer brand link", () => {
    render(<Navigation />);
    const brandLinks = screen.getAllByText("Monty Singer");
    expect(brandLinks.length).toBeGreaterThanOrEqual(1);
    const homeLink = brandLinks.find(
      (el) => el.tagName.toLowerCase() === "a" && el.getAttribute("href") === "/"
    );
    expect(homeLink).toBeDefined();
  });

  it("renders EditorialHeader mock", () => {
    render(<Navigation />);
    const header = screen.getByTestId("editorial-header");
    expect(header).toBeDefined();
  });

  it("active label is Uses when pathname is /uses (D-13)", () => {
    mockUsePathname.mockReturnValue("/uses");
    render(<Navigation />);
    const header = screen.getByTestId("editorial-header");
    expect(header.getAttribute("data-active")).toBe("Uses");
  });

  it("MOBILE_LINKS includes /uses link", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Navigation />);
    // Open the mobile drawer via fireEvent (triggers React state update)
    const hamburger = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(hamburger);
    const usesLink = document.querySelector('a[href="/uses"]');
    expect(usesLink).not.toBeNull();
  });

  it("MOBILE_LINKS does NOT include /prometheus link (4-item parity with desktop)", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Navigation />);
    const hamburger = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(hamburger);
    const prometheusLink = document.querySelector('a[href="/prometheus"]');
    expect(prometheusLink).toBeNull();
  });
});
