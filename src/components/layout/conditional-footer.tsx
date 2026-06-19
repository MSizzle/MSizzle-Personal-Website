"use client";

import { usePathname } from "next/navigation";
import { InkFooter } from "@/components/home-v2/ink-footer";

/**
 * ConditionalFooter — suppresses the global InkFooter on the homepage.
 *
 * The homepage (pathname === "/") uses SlideFooter as slide 5 inside the deck.
 * Rendering InkFooter there would create a double footer.
 *
 * Client Component required because usePathname() is a client-only hook.
 * layout.tsx is a Server Component — this thin wrapper provides the client boundary.
 */
export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <InkFooter />;
}
