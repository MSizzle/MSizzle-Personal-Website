"use client";

import { useRef, useEffect, useCallback } from "react";
import { Photo } from "./photo";

export type CarouselIssue = {
  num: string;
  date: string;
  title: string;
  excerpt: string;
  href?: string;
  /** When true, href points off-site (Substack) and opens in a new tab. */
  external?: boolean;
  /** Issue cover image path (e.g. "/home/issue-12.jpg"); placeholder if unset. */
  cover?: string;
};

type Props = {
  issues: CarouselIssue[];
};

const SUBSTACK_URL = "https://montymonthly.substack.com";

/**
 * MontyMonthlyCarousel - D-09, D-13
 *
 * Horizontal scroll-snap carousel of Monty Monthly issue cards with:
 * - prev/next arrows (scrollBy ±clientWidth*0.62)
 * - dot indicators that sync to nearest-centered card
 * - trailing Vermilion subscribe card linking out to Substack (no on-site email capture)
 *
 * Photo covers are inlined as .photo.dark placeholder blocks (photo.tsx primitive
 * is created in Plan 02; this plan runs in parallel so the markup is inlined).
 *
 * "use client" - passive scroll listener on the track ref; guards SSR.
 */
export function MontyMonthlyCarousel({ issues }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  /**
   * syncDots - finds the nearest-centered slide and toggles .on on its dot.
   * Mirrors sketch syncDots (lines 438-439). Runs inside rAF so it does not
   * thrash layout.
   */
  const syncDots = useCallback(() => {
    const track = trackRef.current;
    const dotsContainer = dotsRef.current;
    if (!track || !dotsContainer) return;

    const slides = Array.from(track.children) as HTMLElement[];
    const dotEls = Array.from(dotsContainer.children) as HTMLElement[];
    const center = track.scrollLeft + track.clientWidth / 2;

    let best = 0;
    let bestDist = Infinity;
    slides.forEach((slide, i) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(slideCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });

    dotEls.forEach((dot, i) => {
      dot.classList.toggle("on", i === best);
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Initialize dots on mount (first dot gets .on)
    syncDots();

    const handleScroll = () => requestAnimationFrame(syncDots);
    track.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      track.removeEventListener("scroll", handleScroll);
    };
  }, [syncDots]);

  const handlePrev = () => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: -track.clientWidth * 0.62, behavior: "smooth" });
  };

  const handleNext = () => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: track.clientWidth * 0.62, behavior: "smooth" });
  };

  const handleDotClick = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement;
    if (slide) {
      slide.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  // +1 for the trailing subscribe card
  const slideCount = issues.length + 1;

  return (
    <>
      {/* Scroll-snap track - .mm-track CSS from Plan 01 (scroll-snap x mandatory + hidden scrollbar) */}
      <div ref={trackRef} className="mm-track">
        {issues.map((issue) => (
          <article key={`issue-${issue.num}`} className="mm-card">
            {/* Real cover when issue.cover is set, else a placeholder block. */}
            <div className="cover">
              <Photo
                dark
                aspectRatio="16/8"
                src={issue.cover}
                alt={issue.cover ? issue.title : undefined}
                caption="Issue cover"
              />
            </div>
            <div className="meta">
              <div className="mm-issue">
                Issue {issue.num} · {issue.date}
              </div>
              <div className="mm-title">{issue.title}</div>
              <p className="mm-ex">{issue.excerpt}</p>
              <a
                className="mm-read"
                href={issue.href ?? SUBSTACK_URL}
                target={issue.href && !issue.external ? undefined : "_blank"}
                rel="noopener noreferrer"
              >
                Read issue →
              </a>
            </div>
          </article>
        ))}

        {/* Subscribe card - D-09/D-13: link-out only, no email form */}
        <div className="mm-sub">
          <h3>Get the next one in your inbox.</h3>
          <p>
            One email a month on what I am building and learning. Read the archive, or subscribe and
            never miss one.
          </p>
          <a
            className="btn"
            href={SUBSTACK_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Subscribe →
          </a>
        </div>
      </div>

      {/* Controls row - prev/next + scroll-synced dots */}
      <div className="mm-ctrls">
        <button className="mm-btn" onClick={handlePrev} aria-label="previous">
          ‹
        </button>
        <button className="mm-btn" onClick={handleNext} aria-label="next">
          ›
        </button>
        <div ref={dotsRef} className="mm-dots">
          {Array.from({ length: slideCount }, (_, i) => (
            <span
              key={i}
              role="button"
              tabIndex={0}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => handleDotClick(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleDotClick(i);
                }
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
