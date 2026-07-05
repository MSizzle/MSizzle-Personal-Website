import { JsonLd } from "@/components/seo/json-ld";
import { buildPersonSchema } from "@/lib/seo/schemas";
import { ExplorativeHomepage } from "@/components/home/explorative-homepage";

/**
 * Homepage — static Server Component for the personal-brand narrative arc.
 *
 * Narrative arc: who am I -> what I am building -> how to engage.
 * Rendered as a fully static Server Component with hardcoded JSX copy (D-10).
 * revalidate=false: no Notion fetch on home path, no ISR needed.
 *
 * ExplorativeHomepage assembles the hero and section beats in document order.
 * Phase 17.1-02 will reorder/extend sections to complete the narrative arc.
 */
export const revalidate = false;

export default function Home() {
  return (
    <>
      <JsonLd data={buildPersonSchema()} />
      <ExplorativeHomepage />
    </>
  );
}
