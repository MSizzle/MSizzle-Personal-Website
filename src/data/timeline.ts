// Deprecated as of Phase 7 (2026-04-15).
// Career timeline data was removed when the About page was rewritten per D-21
// (founder-of-Prometheus framing). Past-job history is no longer surfaced on the site.
// File retained as an empty export to avoid breaking any stale imports during cleanup;
// safe to delete in a future commit.
import type { TimelineEvent } from '@/components/about/timeline'

export const TIMELINE_EVENTS: TimelineEvent[] = []
