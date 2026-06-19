import { JsonLd } from "@/components/seo/json-ld";
import { buildPersonSchema } from "@/lib/seo/schemas";
import { ExplorativeHomepage } from "@/components/home/explorative-homepage";

/**
 * Homepage — static Server Component for the WebGL explorative scroll-story.
 *
 * No Notion data fetched here (D-10: homepage copy is hardcoded JSX in section components).
 * revalidate=false: fully static, no ISR needed on homepage.
 *
 * ExplorativeHomepage is a "use client" orchestrator that:
 *  - Detects WebGL2 availability, touch/small-screen, and reduced-motion preference
 *  - Renders CanvasLoader (dynamic HeroBlobCanvas, after-LCP) on capable desktop
 *  - Renders FallbackPoster on mobile / no-WebGL / reduced-motion
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
