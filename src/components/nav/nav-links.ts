/**
 * Single source of truth for the site's four nav destinations. Previously
 * declared three times — navigation.tsx (MOBILE_LINKS), editorial-header.tsx
 * (LINKS), sticky-nav.tsx (LINKS) — collapsed here as part of quick task
 * 260916-lqq (unify nav into one sticky SiteHeader).
 *
 * Order: Prometheus, Building, Writing, Contact (quick task 260706-tx6
 * reversed D-08's About/Projects/Writing/Uses set). Contact is now the
 * /contact route (quick task 260708-lqc; was a #contact footer anchor).
 */

export type NavLabel = "Prometheus" | "Building" | "Writing" | "Contact";

export type NavLink = {
  label: NavLabel;
  href: string;
  external: boolean;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Prometheus", href: "https://prometheus.today", external: true },
  { label: "Building", href: "/building", external: false },
  { label: "Writing", href: "/writing", external: false },
  { label: "Contact", href: "/contact", external: false },
];

/**
 * Derives the active nav label from the current pathname, preserving the
 * exact rules navigation.tsx and editorial-header.tsx used before this
 * unification: /building -> Building, /writing or any /blog/* -> Writing,
 * /contact -> Contact, anything else (including /) -> undefined. Prometheus
 * is external and is never returned as active.
 */
export function activeNavLabel(pathname: string): NavLabel | undefined {
  if (pathname === "/building") return "Building";
  if (pathname === "/writing" || pathname.startsWith("/blog")) return "Writing";
  if (pathname === "/contact") return "Contact";
  return undefined;
}
