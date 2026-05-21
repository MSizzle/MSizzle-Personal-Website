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
