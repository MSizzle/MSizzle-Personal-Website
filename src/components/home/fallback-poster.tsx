import Image from "next/image";
import { cn } from "@/utils/cn";

type Props = {
  className?: string;
};

/**
 * FallbackPoster — static WebP still of the 3D hero blob for reduced-motion / no-WebGL contexts.
 *
 * Server Component — no "use client".
 *
 * LCP quirk (MEMORY.md): Next.js 16 Image `priority` alone does NOT auto-emit the
 * browser-level resource hint. Setting both `priority` and the explicit prop is required.
 *
 * /public/hero-blob-poster.webp placeholder created in Plan 15-01.
 */
export function FallbackPoster({ className }: Props) {
  return (
    <div className={cn("relative w-full h-full", className)}>
      <Image
        src="/hero-blob-poster.webp"
        alt="3D hero object — morphing blob with crimson rim"
        fill
        priority
        fetchPriority="high"
        loading="eager"
        sizes="(max-width: 760px) 100vw, 45vw"
        className="object-contain"
      />
    </div>
  );
}
