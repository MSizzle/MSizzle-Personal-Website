import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

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
  const mockProject = {
    id: "test-1",
    title: "Test Project",
    slug: "test-project",
    description: "A test project",
    tags: ["React", "TypeScript"],
    image: "https://example.com/img.jpg",
    externalUrl: "https://example.com",
    status: "Published" as const,
    order: 1,
  };

  it("renders project title and description", async () => {
    const { ProjectCard } = await import("@/components/projects/project-card");
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("Test Project")).toBeDefined();
    expect(screen.getByText("A test project")).toBeDefined();
  });

  it("contains View Project CTA text in overlay", async () => {
    const { ProjectCard } = await import("@/components/projects/project-card");
    const { container } = render(<ProjectCard project={mockProject} />);
    // After hover/click, overlay should contain CTA
    const card = container.firstElementChild as HTMLElement;
    fireEvent.mouseEnter(card);
    // Overlay CTA text should be present
    expect(screen.getByText(/View Project/)).toBeDefined();
  });
});
