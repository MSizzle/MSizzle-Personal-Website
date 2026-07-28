/**
 * Manual related-essays map per D-41 groupings.
 * Keys and values are blog post slugs (Notion "Slug" property, kebab-case fallback).
 * If a slug listed here does not exist in the live Notion data, the related-essays
 * component in Plan 08 falls back to showing fewer items instead of throwing.
 */
export const RELATED_ESSAYS: Record<string, string[]> = {
  // Philosophy / Life
  'choosing-faith': ['practical-philosophy', 'defiant-optimism'],
  'practical-philosophy': ['choosing-faith', 'pursuit-of-happierness'],
  'defiant-optimism': ['pursuit-of-happierness', 'capable-of-change'],
  'pursuit-of-happierness': ['defiant-optimism', 'practical-philosophy'],
  'capable-of-change': ['demystifying-merlin', 'earning-magic'],
  'demystifying-merlin': ['earning-magic', 'staring-into-the-void'],
  'earning-magic': ['demystifying-merlin', 'capable-of-change'],
  'staring-into-the-void': ['demystifying-merlin', 'choosing-faith'],

  // Technology / AI
  // The live Notion slug is 'ai-nibbling'; this map said
  // 'ai-is-nibbling-the-world', so the key never matched and the two entries
  // referencing it silently resolved to nothing (fixed 260728-kcg).
  'ai-nibbling': ['algorithmic-content', 'standing-on-sediment'],
  'algorithmic-content': ['ai-nibbling', 'standing-on-sediment'],
  'standing-on-sediment': ['ai-nibbling', 'algorithmic-content'],

  // Culture / Observation
  'vibe-check': ['algorithmic-content', 'defiant-optimism'],

  // Relationships / Personal
  'perfect-partner': ['discipline-and-dog-names'],
  'discipline-and-dog-names': ['perfect-partner'],

  // Career / Ambition
  'hideous-odds-of-getting-rich': ['art-of-living-fast-and-slow'],
  'art-of-living-fast-and-slow': ['hideous-odds-of-getting-rich'],
}
