import { JsonLd } from "@/components/seo/json-ld";
import { buildPersonSchema } from "@/lib/seo/schemas";
import { DeckHomepage } from "@/components/home-deck/deck-homepage";

/**
 * Homepage — static Server Component for the v3 slide-deck experience.
 *
 * No Notion data fetched here (D-10: slide copy is hardcoded JSX).
 * revalidate=false: fully static, no ISR needed on homepage.
 *
 * DeckHomepage is a "use client" component that:
 *  - Dynamically imports HeroBlobCanvas with ssr:false (avoids build error)
 *  - Conditionally renders deck vs native-scroll based on touch/reduced-motion
 */
export const revalidate = false;

export default function Home() {
  return (
    <>
      <JsonLd data={buildPersonSchema()} />
      <DeckHomepage />
    </>
  );
}
