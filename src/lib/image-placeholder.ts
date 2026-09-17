/**
 * Shared LQIP (low-quality image placeholder) for every Notion / Substack
 * cover image site-wide, quick task 260723-g2q (FIX 1: fade-in + placeholder).
 *
 * This is a single fixed neutral-grey 8x8 solid PNG, reused everywhere as a
 * next/image `blurDataURL`, deliberately NOT a per-image blurhash / dominant
 * color computation -- that would need an extra sharp pass at generation time
 * (explicitly out of scope for this task, and matches the deferred
 * "precompute into Blob storage" bigger lever the orchestrator ruled out).
 *
 * Zero hue: matches the existing rgba(17,17,17,0.08) neutral placeholder tone
 * already used elsewhere (.pb-media, card-cover's frame background), against
 * the v5 bone/ink neutral system.
 */
export const NEUTRAL_BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAD0lEQVR4nGO4hQMwDC0JAOJ5o4HcbYCNAAAAAElFTkSuQmCC";
