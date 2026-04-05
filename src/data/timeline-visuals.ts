// Maps timeline event IDs to their visual representations.
// If a `logo` path is provided and the file exists in /public/logos/,
// it will be used. Otherwise the themed emoji is shown as fallback.

export interface EventVisual {
  emoji: string
  logo?: string
}

export const TIMELINE_VISUALS: Record<string, EventVisual> = {
  elevate: { emoji: '🏢', logo: '/logos/elevate.png' },
  'global-platinum': { emoji: '💎', logo: '/logos/global-platinum.png' },
  orbit: { emoji: '⚡', logo: '/logos/orbit.png' },
  teton: { emoji: '🏔️', logo: '/logos/teton.png' },
  sustany: { emoji: '🌊', logo: '/logos/sustany.png' },
  'georgetown-ventures': { emoji: '🎓', logo: '/logos/georgetown-ventures.png' },
  inari: { emoji: '🌱', logo: '/logos/inari.png' },
  leerink: { emoji: '🏙️', logo: '/logos/leerink.png' },
  e2b4: { emoji: '🔌', logo: '/logos/e2b4.png' },
  prometheus: { emoji: '🏛️', logo: '/logos/prometheus.png' },
}
