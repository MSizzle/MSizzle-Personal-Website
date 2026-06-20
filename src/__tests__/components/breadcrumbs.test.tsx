/**
 * Test scaffold for Breadcrumbs component — owned by Plans 06/07 (16-06/16-07).
 *
 * The Breadcrumbs component exists now (src/components/seo/breadcrumbs.tsx),
 * so Wave 0 tests verify the component contract directly.
 * Key assertion: Writing breadcrumb href is "/writing" not "/blog" (per D-14).
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

// Mock JsonLd to avoid schema dependency in tests
vi.mock("@/components/seo/json-ld", () => ({
  JsonLd: () => null,
}));

// Mock the schema builder
vi.mock("@/lib/seo/schemas", () => ({
  buildBreadcrumbListSchema: vi.fn().mockReturnValue({}),
}));

import { Breadcrumbs } from "@/components/seo/breadcrumbs";

const TEST_ITEMS = [
  { name: "Home", href: "/" },
  { name: "Writing", href: "/writing" },
  { name: "Test Post" },
];

describe("Breadcrumbs component (Plans 06/07 / D-14)", () => {
  it("renders all breadcrumb item names", () => {
    render(<Breadcrumbs items={TEST_ITEMS} />);
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Writing")).toBeDefined();
    expect(screen.getByText("Test Post")).toBeDefined();
  });

  it("Writing breadcrumb link has href /writing (not /blog) per D-14", () => {
    render(<Breadcrumbs items={TEST_ITEMS} />);
    // Use role-based query to find the Writing link specifically
    const links = screen.getAllByRole("link");
    const writingLink = links.find(
      (l) => l.textContent === "Writing"
    );
    expect(writingLink).toBeDefined();
    expect(writingLink?.getAttribute("href")).toBe("/writing");
  });

  it("last breadcrumb item is not a link (current page)", () => {
    render(<Breadcrumbs items={TEST_ITEMS} />);
    // "Test Post" is the last item — should be a span with aria-current="page"
    const spans = screen.getAllByText("Test Post");
    const currentSpan = spans.find(
      (el) =>
        el.tagName.toLowerCase() === "span" &&
        el.getAttribute("aria-current") === "page"
    );
    expect(currentSpan).toBeDefined();
  });

  it.todo("blog/[slug] breadcrumbs use /writing parent link (Plans 06)");
  it.todo("projects/[slug] breadcrumbs use /projects parent link (Plan 07)");
  it.todo("JSON-LD BreadcrumbList schema is emitted (Plans 06/07)");
});
