/**
 * Home page content defaults.
 *
 * Layout pass 2026-06-13 (see Dropbox `Home-Page-Layout.md`): Baserate + Panda
 * are full-bleed scroll-in flagship showpieces (Baserate first, most flourish);
 * Wingstop / Samsung / Capabilities are a compact secondary row beneath them.
 *
 * Copy is intentionally minimal — the work and the motion carry the page. All
 * strings live here; the Payload blocks carry only optional overrides, same
 * pattern as the baserate/panda case-study blocks.
 */

export const intro = {
  // One large line that bridges the hero into the flagship work.
  line: 'Two flagship products, built end to end — brand, product, motion, and launch.',
}

export interface FlagshipContent {
  kicker: string
  title: string
  oneLine: string
  meta: string
  href: string
  /** CSS accent var value applied to the stage root. */
  accent: string
}

export const baserate: FlagshipContent = {
  kicker: '01 — Investor Systems',
  title: 'Baserate',
  oneLine:
    'The investment operating system for family offices — brand, UI, and marketing site designed end to end. 70+ features.',
  meta: 'Lead Product & Brand Designer · 2022–2024',
  href: '/work/baserate',
  accent: '#0A2A66', // deep Baserate navy/blue
}

export const panda: FlagshipContent = {
  kicker: '02 — Consumer Scale',
  title: 'Panda Express',
  oneLine:
    'Lead designer on the app for America’s largest Asian-dining brand — 4.8★, 16M+ rewards members.',
  meta: 'Lead Designer & Art Director · 2020–2022',
  href: '/work/panda-express',
  accent: '#D02B2E', // Panda red (matches --px-red on the case study)
}

export interface SecondaryItem {
  title: string
  blurb: string
  meta: string
  href: string
}

export const secondary: SecondaryItem[] = [
  {
    title: 'Wingstop',
    blurb: 'Flavor-first ordering, art-directed across the app.',
    meta: 'Lead Designer & Art Director',
    href: '/work/wingstop',
  },
  {
    title: 'Samsung',
    blurb: 'Enterprise-scale launch design, early career.',
    meta: 'Designer (via Razorfish)',
    href: '/work/samsung',
  },
  {
    title: 'Capabilities',
    blurb: 'Eight disciplines, one operator.',
    meta: 'What I do',
    href: '/personal/capabilities',
  },
]
