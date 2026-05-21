// Date formatting helpers for the editorial homepage and archive pages.
// Pure functions; safe to call from both Server and Client Components.

export function formatMonthYear(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso)
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toUpperCase();
}

export function formatMonthDay(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso)
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();
}

/**
 * Extract just the day-of-month numeral from an ISO date string.
 * Returns "" for null input (mirrors formatMonthYear/formatMonthDay).
 *
 * Examples:
 *   formatDayNumeral("2026-06-12")             → "12"
 *   formatDayNumeral("2026-06-12T19:00:00Z")   → "12"
 *   formatDayNumeral(null)                     → ""
 *
 * Used by /events Upcoming section giant day numerals (84px featured /
 * 56px non-featured per D-18 in Plan 11-04). Uses UTC accessors because
 * Notion serializes date-only ISO strings as UTC midnight; getDate()
 * (local) can drift the displayed day by ±1 across timezones (D-17).
 */
export function formatDayNumeral(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).getUTCDate().toString();
}
