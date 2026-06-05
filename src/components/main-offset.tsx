import type { ReactNode } from "react";

/**
 * Mobile Navigation bar is fixed (height 64px) — needs pt-16 offset on mobile.
 * Desktop EditorialHeader is inline content (not fixed) — no offset needed.
 * Globalized post-Path-2: same behavior on every route.
 */
export function MainOffset({ children }: { children: ReactNode }) {
  return <main className="pt-16 md:pt-0">{children}</main>;
}
