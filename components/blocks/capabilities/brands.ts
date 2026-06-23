import type { BrandDef } from './BrandLogo'

/**
 * Brand registry — one source of truth for the Capabilities logo walls / rails.
 *
 * `src` is set where we have a clean real logo (the four case-study brands in
 * /public + Joshua's authored brands on disk, copied to public/capabilities/
 * logos/authored). Everything else renders as a clean brand-colored WORDMARK
 * (BrandLogo fallback) for now — real client logos drop in here later by adding
 * a `src`. Colors are the brands' primary brand colors.
 *
 * NOTE: dark bands prefer white/light logo variants; where a brand only has a
 * dark mark we fall back to the colored wordmark which is set to read on dark.
 */

const L = '/capabilities/logos'

export const BRANDS: Record<string, BrandDef> = {
  // ── Case-study brands (real logos in /public) ──────────────
  panda: { name: 'Panda Express', src: '/panda/panda-logo.svg', color: '#D1282E' },
  wingstop: { name: 'Wingstop', src: '/wingstop/logo/wingstop.svg', color: '#00857C' },
  wingstopWhite: { name: 'Wingstop', src: '/wingstop/logo/wingstop-white.svg', color: '#ffffff' },
  samsung: { name: 'Samsung', src: '/samsung/brand/samsung-wordmark.svg', color: '#1428A0' },
  samsungWhite: { name: 'Samsung', src: '/samsung/brand/samsung-wordmark-white.png', color: '#ffffff' },
  baserate: { name: 'Baserate', src: '/baserate/branding/logos/baserate-logo.svg', color: '#1a2233' },
  journalytic: { name: 'Journalytic', src: '/baserate/branding/logos/journalytic-logo.svg', color: '#1a2233' },

  // ── Authored brands (real logos from disk) ─────────────────
  dopa: { name: 'DOPA', src: `${L}/authored/dopa-black.png`, color: '#1a2233' },
  dopaWhite: { name: 'DOPA', src: `${L}/authored/dopa-white.png`, color: '#ffffff' },
  jubilee: { name: 'Jubilee', src: `${L}/authored/jubilee.png`, color: '#1a2233' },
  trees: { name: 'Trees', src: `${L}/trees.svg`, color: '#2e7d32' },
  rosetta: { name: 'Rosetta', wordmark: 'Rosetta', color: '#1a2233' },
  blaze: { name: 'Blaze', src: `${L}/blaze.svg`, color: '#F5A623' },

  // ── Client brands — REAL logos (verified); 3 remain wordmarks ──
  mindbody: { name: 'Mindbody', src: `${L}/mindbody.svg`, color: '#00B0B9' },
  raisingCanes: { name: 'Raising Cane’s', src: `${L}/raising-canes.svg`, color: '#B01E24' },
  daveAndBusters: { name: 'Dave & Buster’s', src: `${L}/dave-and-busters.svg`, color: '#E2231A' },
  vfCorp: { name: 'VF Corp · Work Authority', src: `${L}/vf-corp.svg`, color: '#1F4E96' },
  pepsi: { name: 'Pepsi', src: `${L}/pepsi.svg`, color: '#004B93' },
  chandon: { name: 'Chandon', src: `${L}/chandon.svg`, color: '#1a1a1a' },
  dairyQueen: { name: 'Dairy Queen', src: `${L}/dairy-queen.svg`, color: '#E4002B' },
  kfc: { name: 'KFC', src: `${L}/kfc.svg`, color: '#A6093D' },
  petsmart: { name: 'PetSmart', src: `${L}/petsmart.svg`, color: '#0072CE' },
  schick: { name: 'Schick', src: `${L}/schick.svg`, color: '#005EB8' },
  // ── still wordmarks (no clean logo sourced yet) ────────────
  cbtl: { name: 'The Coffee Bean & Tea Leaf', src: `${L}/cbtl.png`, color: '#53277E' },
  trueFoodKitchen: { name: 'True Food Kitchen', wordmark: 'True Food Kitchen', color: '#2F7D3B' },
  noodles: { name: 'Noodles & Company', wordmark: 'Noodles & Co.', color: '#C8102E' },
  conco: { name: 'ConCo', wordmark: 'ConCo', color: '#1a2233' },
}

/** Helper: pick a list of brands by key. */
export const pick = (...keys: string[]): BrandDef[] => keys.map((k) => BRANDS[k]).filter(Boolean)
