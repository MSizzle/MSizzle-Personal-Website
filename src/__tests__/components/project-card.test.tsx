import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Project } from "@/lib/notion-projects";

vi.mock("motion/react", () => ({
  m: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

vi.mock("lucide-react", () => ({
  ExternalLink: () => <span data-testid="external-link-icon" />,
}));

describe("ProjectCard hover-reveal (PORT-02)", () => {
  const mockProject: Project = {
    id: "test-1",
    title: "Test Project",
    slug: "test-project",
    description: "A test project",
    tags: ["React", "TypeScript"],
    image: "https://example.com/img.jpg",
    emoji: null,
    externalUrl: "https://example.com",
    featured: true,
    published: true,
    lastEdited: "2026-01-01",
  };

  it("renders project title and description", async () => {
    const { ProjectCard } = await import("@/components/projects/project-card");
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("Test Project")).toBeDefined();
    expect(screen.getByText("A test project")).toBeDefined();
  });

  // PORT-02 hover-reveal overlay was superseded by the simplified editorial
  // card design. Kept as todos in case we reintroduce the hover-reveal layer.
  it.todo("contains View Project CTA text in overlay");
  it.todo("renders data-umami-event on external link");
});
