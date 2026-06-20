/**
 * Test scaffold for VideoCard component — owned by Plan 05 (16-05).
 *
 * Wave 0 tests verify the component renders title and link attributes.
 * Note: Plan 05 patches VideoCard to accept target/rel props. Tests for
 * target="_blank" and rel="noopener noreferrer" are deferred to Plan 05
 * as the current component does not yet accept those props.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

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

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    width,
    height,
    sizes,
    className,
    ...props
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    sizes?: string;
    className?: string;
    [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}));

import { VideoCard } from "@/components/v3/video-card";

describe("VideoCard component (Plan 05 / PG-02)", () => {
  it("renders the video title", () => {
    render(
      <VideoCard
        title="The Philosophy of Building"
        channel="Test Channel"
        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      />
    );
    expect(screen.getByText("The Philosophy of Building")).toBeDefined();
  });

  it("renders the channel name", () => {
    render(
      <VideoCard
        title="Channel Test Video"
        channel="Unique Channel Name"
        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      />
    );
    expect(screen.getByText("Unique Channel Name")).toBeDefined();
  });

  it("renders a link with the correct href", () => {
    const testHref = "https://www.youtube.com/watch?v=abc123def456";
    render(
      <VideoCard
        title="Href Test Video"
        channel="Href Channel"
        href={testHref}
      />
    );
    const links = screen.getAllByRole("link");
    // Find the link with our specific href
    const link = links.find((l) => l.getAttribute("href") === testHref);
    expect(link).toBeDefined();
    expect(link?.getAttribute("href")).toBe(testHref);
  });

  it("link has target=_blank and rel=noopener noreferrer when props are passed (Plan 05)", () => {
    const { container } = render(
      <VideoCard
        title="External Video"
        channel="YouTube Channel"
        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        target="_blank"
        rel="noopener noreferrer"
      />
    );
    const link = container.querySelector("a");
    expect(link?.getAttribute("target")).toBe("_blank");
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it.todo("VideoCard renders play triangle via CSS border trick (Plan 05)");
  it.todo("VideoCard hover state lifts card (Plan 05)");
});
