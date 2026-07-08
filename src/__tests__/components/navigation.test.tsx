/**
 * Test suite for Navigation component — Plan 02 (16-02),
 * updated for the 260706-tx6 nav rework (reverses D-08).
 *
 * Current nav set: Prometheus (external) / Building / Writing / Contact (/contact route,
 * quick task 260708-lqc; was a #contact footer anchor).
 * Tests verify:
 *  - /building → activeLabel === 'Building'
 *  - MOBILE_LINKS includes /building; Prometheus is an external link (not /prometheus)
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

  it("active label is Building when pathname is /building (260706-tx6)", () => {
    mockUsePathname.mockReturnValue("/building");
    render(<Navigation />);
    const header = screen.getByTestId("editorial-header");
    expect(header.getAttribute("data-active")).toBe("Building");
  });

  it("MOBILE_LINKS includes /building link", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Navigation />);
    // Open the mobile drawer via fireEvent (triggers React state update)
    const hamburger = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(hamburger);
    const buildingLink = document.querySelector('a[href="/building"]');
    expect(buildingLink).not.toBeNull();
  });

  it("MOBILE_LINKS Prometheus is an external link, not the /prometheus route", () => {
    mockUsePathname.mockReturnValue("/");
    render(<Navigation />);
    const hamburger = screen.getByRole("button", { name: /open navigation menu/i });
    fireEvent.click(hamburger);
    // Prometheus now points at the external site (260706-fast9), not the /prometheus route.
    expect(document.querySelector('a[href="/prometheus"]')).toBeNull();
    const external = document.querySelector('a[href="https://prometheus.today"]');
    expect(external).not.toBeNull();
    expect(external?.getAttribute("target")).toBe("_blank");
    expect(external?.getAttribute("rel")).toContain("noopener");
  });
});
