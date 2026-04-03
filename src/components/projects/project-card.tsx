"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { m, AnimatePresence, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Project } from "@/lib/notion-projects";

export function ProjectCard({ project }: { project: Project }) {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  // D-09: Tap-outside dismisses overlay on mobile
  const handleClickOutside = useCallback((e: MouseEvent | TouchEvent) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      setOverlayVisible(false);
    }
  }, []);

  useEffect(() => {
    if (overlayVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [overlayVisible, handleClickOutside]);

  return (
    <div
      ref={cardRef}
      className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden transition-colors duration-200"
      onMouseEnter={() => setOverlayVisible(true)}
      onMouseLeave={() => setOverlayVisible(false)}
      onClick={() => setOverlayVisible((v) => !v)}
    >
      {/* Image area with overlay */}
      <div className="relative aspect-video w-full overflow-hidden">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-[var(--border)]" />
        )}

        {/* Hover-reveal overlay (D-08) */}
        <AnimatePresence>
          {overlayVisible && (
            <m.div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/75 p-4"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: "100%" }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: "100%" }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.25,
                ease: "easeOut",
              }}
            >
              <Link
                href={`/projects/${project.slug}`}
                className="inline-flex min-h-[44px] items-center rounded-lg px-4 py-2 text-sm font-semibold text-[var(--accent)] hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                View Project &rarr;
              </Link>
              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-neutral-100/20 px-2.5 py-0.5 text-xs text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* Title and description below image (D-08: remain visible) */}
      <div className="p-6">
        <Link
          href={`/projects/${project.slug}`}
          className="block text-xl font-semibold tracking-tight hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {project.title}
        </Link>
        <p className="mt-2 text-sm text-[var(--fg-muted)] line-clamp-3">
          {project.description}
        </p>

        {/* Tags below description */}
        {project.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* External link */}
        {project.externalUrl && (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="project-external-link"
            data-umami-event-title={project.title}
            className="mt-4 inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Check out more information <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
  );
}
