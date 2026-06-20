/**
 * Test suite for V3Footer component — Plan 02 (16-02).
 *
 * Verifies the full-sitemap footer renders correctly with Pumpkin Amber tokens,
 * locked "Let's be friends." copy, and all required route links.
 */
import { describe, it, expect, beforeEach } from "vitest";
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

import { V3Footer } from "@/components/layout/v3-footer";
import { vi } from "vitest";

describe("V3Footer component (Plan 02 / D-11, D-12)", () => {
  it('renders "Let\'s be friends." headline text (locked copy from prototype 002)', () => {
    render(<V3Footer />);
    expect(screen.getByText("Let's be friends.")).toBeDefined();
  });

  it("renders /uses link in footer nav (Stack under Building column)", () => {
    render(<V3Footer />);
    const usesLink = document.querySelector('a[href="/uses"]');
    expect(usesLink).not.toBeNull();
  });

  it("renders /watching link in footer nav (Archive column)", () => {
    render(<V3Footer />);
    const watchingLink = document.querySelector('a[href="/watching"]');
    expect(watchingLink).not.toBeNull();
  });

  it("renders /prometheus external link in footer nav (Community column)", () => {
    render(<V3Footer />);
    const prometheusLink = document.querySelector('a[href="https://prometheus.today"]');
    expect(prometheusLink).not.toBeNull();
  });

  it("external prometheus link has noopener noreferrer (T-16-04 security)", () => {
    render(<V3Footer />);
    const prometheusLink = document.querySelector('a[href="https://prometheus.today"]');
    expect(prometheusLink).not.toBeNull();
    expect(prometheusLink?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(prometheusLink?.getAttribute("target")).toBe("_blank");
  });

  it("renders /photos link in footer nav (Archive column)", () => {
    render(<V3Footer />);
    const photosLink = document.querySelector('a[href="/photos"]');
    expect(photosLink).not.toBeNull();
  });

  it("footer uses Pumpkin Amber surface token (no v2 tokens)", () => {
    const { container } = render(<V3Footer />);
    const footer = container.querySelector("footer");
    expect(footer).not.toBeNull();
    // Verify Pumpkin Amber class is present (bg-[var(--color-surface)])
    expect(footer?.className).toContain("--color-surface");
    // Verify no v2 tokens present
    expect(footer?.className).not.toContain("bg-footer-bg");
    expect(footer?.className).not.toContain("text-ink");
    expect(footer?.className).not.toContain("bg-paper");
  });
});
