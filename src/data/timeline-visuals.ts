// Deprecated as of Phase 7 (2026-04-15).
// Timeline visuals were tied to the career-history About page that was
// retired in Plan 07-04. File retained as an empty export to avoid
// breaking any stale imports; safe to delete in a future commit.

export interface EventVisual {
  emoji: string
  logo?: string
}

export const TIMELINE_VISUALS: Record<string, EventVisual> = {}
