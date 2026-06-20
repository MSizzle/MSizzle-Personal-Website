/**
 * Test scaffold for Navigation component — owned by Plan 02 (16-02).
 *
 * Wave 0 tests verify the Navigation component renders. Tests for /uses
 * and /watching active labels are deferred to Plan 02 since those route
 * mappings are added in Plan 02.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

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

vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue("/projects"),
}));

// Mock EditorialHeader to avoid deep dependency chain in scaffold tests
vi.mock("@/components/home-v2/editorial-header", () => ({
  EditorialHeader: ({
    active,
  }: {
    active?: string;
  }) => (
    <div data-testid="editorial-header" data-active={active ?? ""} />
  ),
}));

import { Navigation } from "@/components/nav/navigation";

describe("Navigation component (Plan 02 / D-13)", () => {
  it("renders without error on a known route", () => {
    const { container } = render(<Navigation />);
    expect(container).toBeDefined();
  });

  it("renders Monty Singer brand link", () => {
    render(<Navigation />);
    // Use getAllByText to handle case where brand link may render once
    const brandLinks = screen.getAllByText("Monty Singer");
    expect(brandLinks.length).toBeGreaterThanOrEqual(1);
    // At least one should be an anchor pointing to /
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

  it.todo(
    "active label is Uses when pathname is /uses (Plan 02 — route mapping not yet added)"
  );
  it.todo(
    "active label is Watching when pathname is /watching (Plan 02 — route mapping not yet added)"
  );
  it.todo(
    "MOBILE_LINKS includes /uses and /watching entries (Plan 02)"
  );
  it.todo(
    "MOBILE_LINKS includes /prometheus link (Plan 02)"
  );
});
