"use client";

import { usePathname } from "next/navigation";
import { V3Footer } from "@/components/layout/v3-footer";

/**
 * ConditionalFooter — suppresses the global footer on the homepage.
 *
 * The homepage (pathname === "/") handles its own footer treatment.
 * Non-homepage routes render V3Footer (Pumpkin Amber full-sitemap footer).
 *
 * InkFooter (v2) is preserved untouched in src/components/home-v2/ink-footer.tsx
 * as a reference until Phase 17 confirms the swap is complete.
 *
 * Client Component required because usePathname() is a client-only hook.
 * layout.tsx is a Server Component — this thin wrapper provides the client boundary.
 */
export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <V3Footer />;
}
