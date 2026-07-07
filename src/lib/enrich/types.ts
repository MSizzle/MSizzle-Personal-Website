import type { LoveType } from "@/lib/notion-loves";

/** What a provider is handed to look an item up. */
export interface EnrichInput {
  title: string;
  type: LoveType;
  /** Existing URL on the row (YouTube needs it; others may ignore). */
  url?: string;
}

/**
 * Raw facts a provider found. Every field is optional: an absent field means
 * "could not find this", and the engine simply skips it (never writes junk).
 * `context` is a longer synopsis used only to seed the Note draft, never written
 * to Notion verbatim.
 */
export interface ProviderResult {
  coverUrl?: string;
  subtitle?: string;
  url?: string;
  context?: string;
}

/** A provider: title + type in, best-effort facts (or null) out. */
export type Provider = (input: EnrichInput) => Promise<ProviderResult | null>;

/** The set of fields the engine may write back to a Notion page. */
export interface LovePatch {
  subtitle?: string;
  url?: string;
  note?: string;
  coverUrl?: string;
}
