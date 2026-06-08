/**
 * Baserate design tokens — imported from the Baserate functional app
 * (`src/lib/tokens.ts`) so the Handoff section's live UI elements render with
 * the exact same constants the real product uses. Trimmed to only what the
 * three ported components (FeelingSlider, RankingReorder, CommentSystem) need.
 *
 * Source of truth was the app's `investor-toolkit-prototype.html`. Kept here so
 * the portfolio no longer depends on the app folder.
 */

export const T = {
  blue700: '#073984',
  blue50: '#e7eef9',
  green700: '#007438',
  grey950: '#0f0f0f',
  grey900: '#2e2e32',
  grey700: '#424246',
  grey500: '#7e7f88',
  grey400: '#545560',
  grey300: '#dcdce1',
  grey200: '#ebecf0',
  grey100: '#f6f6f9',
  grey50: '#f0f0f0',
  white: '#ffffff',
  textDark: '#242627',
  textMedium: '#545560',
  textLight: '#7e7f88',
  textIdea: '#007438', // stock tickers (bold green)
  textDeactive: '#9c9da7',
  notifBlue: '#2079ff',
} as const

export const S = {
  // Points at the self-hosted Roboto loaded in the frontend layout
  // (--font-roboto), falling back to Roboto/system sans.
  fontFamily: "var(--font-roboto), 'Roboto', ui-sans-serif, system-ui, sans-serif",
  fontVar: "'wdth' 100",
} as const

// ─── Feeling tool (11-point scale, 0 = worst, 10 = best) ───────────────────

export const FEELING_COLORS = [
  '#e53935', // 0  Numb
  '#f4511e', // 1  Awful
  '#ff7043', // 2  Very Poor
  '#ffaa42', // 3  Poor
  '#ffbb42', // 4  Subpar
  '#ecd646', // 5  Mediocre
  '#cad94f', // 6  Average
  '#8bc34a', // 7  Good
  '#5cc26a', // 8  Great
  '#47d56e', // 9  Superb
  '#00c853', // 10 Perfect
] as const

export const FEELING_LABELS: Record<number, string> = {
  0: 'Numb',
  1: 'Awful',
  2: 'Very Poor',
  3: 'Poor',
  4: 'Subpar',
  5: 'Mediocre',
  6: 'Average',
  7: 'Good',
  8: 'Great',
  9: 'Superb',
  10: 'Perfect',
}

// ─── Initials-avatar fallback (from the app's lib/avatars.ts) ──────────────
// Generates a deterministic colored circle with initials as a data: URI, so
// the demo comment thread needs no photo assets.

const INITIALS_PALETTE = [
  '#475569', '#5b4d8c', '#2c4173', '#2f5235', '#6b4423',
  '#525b6b', '#7d6b94', '#5d6e6b', '#7a5d5c', '#3d6477',
]

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export function initialsAvatar(displayName: string, key?: string): string {
  const parts = (displayName || '?').trim().split(/\s+/).filter(Boolean)
  const initials = (
    parts.length === 0
      ? '?'
      : parts.length === 1
        ? parts[0].slice(0, 2)
        : parts[0][0] + parts[parts.length - 1][0]
  ).toUpperCase()
  const hue = hashString(key || displayName)
  const bg = INITIALS_PALETTE[hue % INITIALS_PALETTE.length]
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>` +
    `<rect width='64' height='64' rx='32' fill='${bg}'/>` +
    `<text x='50%' y='50%' dy='0.35em' text-anchor='middle' ` +
    `font-family='Roboto, Arial, sans-serif' font-weight='700' font-size='26' fill='white'>` +
    `${initials}</text>` +
    `</svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}
