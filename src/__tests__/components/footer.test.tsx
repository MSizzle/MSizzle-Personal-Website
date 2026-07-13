/**
 * Test suite for SiteFooter — the single site-wide footer (sketch 014 concept
 * 01). Replaced V3Footer + the homepage SectionFooter.
 *
 * Verifies the signature, the route links, external-link security, and that it
 * keeps id="contact". (The nav "Contact" now points at the /contact route as of
 * quick task 260708-lqc; the footer id is retained as a stable in-page anchor.)
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

beforeEach(() => {
  cleanup();
});

// Mock next/link for jsdom rendering
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

import { SiteFooter } from "@/components/layout/site-footer";

describe("SiteFooter (single site-wide footer)", () => {
  it("renders the Monty Singer signature", () => {
    render(<SiteFooter />);
    expect(screen.getByText("Monty Singer")).toBeDefined();
  });

  it("keeps id=contact so the nav Contact anchor still targets it", () => {
    const { container } = render(<SiteFooter />);
    expect(container.querySelector("footer#contact")).not.toBeNull();
  });

  it("renders the core route links (Building, Writing, Things I Love)", () => {
    render(<SiteFooter />);
    expect(document.querySelector('a[href="/building"]')).not.toBeNull();
    expect(document.querySelector('a[href="/writing"]')).not.toBeNull();
    expect(document.querySelector('a[href="/#loves"]')).not.toBeNull();
  });

  it("external links carry target=_blank + rel=noopener noreferrer", () => {
    render(<SiteFooter />);
    const x = document.querySelector('a[href="https://x.com/themontysinger"]');
    expect(x).not.toBeNull();
    expect(x?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(x?.getAttribute("target")).toBe("_blank");
  });

  it("does NOT render the retired footer copy", () => {
    render(<SiteFooter />);
    expect(screen.queryByText("Let's be friends.")).toBeNull();
    expect(screen.queryByText(/End of archive/i)).toBeNull();
  });

  it("has no em dash in its rendered copy (CLAUDE.md rule)", () => {
    const { container } = render(<SiteFooter />);
    expect(container.textContent ?? "").not.toMatch(/[—–]/);
  });
});
