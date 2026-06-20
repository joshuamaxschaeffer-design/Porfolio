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
  trees: { name: 'Trees', src: `${L}/authored/trees.svg`, color: '#2e7d32' },
  rosetta: { name: 'Rosetta', wordmark: 'Rosetta', color: '#1a2233' },
  blaze: { name: 'Blaze', wordmark: 'BLAZE', color: '#F5A623' },

  // ── Client brands (styled wordmark for now; brand colors) ──
  mindbody: { name: 'Mindbody', wordmark: 'MINDBODY', color: '#00B0B9' },
  raisingCanes: { name: 'Raising Cane’s', wordmark: 'Raising Cane’s', color: '#B01E24' },
  cbtl: { name: 'The Coffee Bean & Tea Leaf', wordmark: 'Coffee Bean & Tea Leaf', color: '#53277E' },
  daveAndBusters: { name: 'Dave & Buster’s', wordmark: 'Dave & Buster’s', color: '#E2231A' },
  trueFoodKitchen: { name: 'True Food Kitchen', wordmark: 'True Food Kitchen', color: '#2F7D3B' },
  vfCorp: { name: 'VF Corp · Work Authority', wordmark: 'Work Authority', color: '#1F4E96' },
  noodles: { name: 'Noodles & Company', wordmark: 'Noodles & Co.', color: '#C8102E' },
  pepsi: { name: 'Pepsi', src: `${L}/pepsi.svg`, color: '#004B93' },
  chandon: { name: 'Chandon', wordmark: 'CHANDON', color: '#1a1a1a' },
  dairyQueen: { name: 'Dairy Queen', wordmark: 'DQ', color: '#E4002B' },
  kfc: { name: 'KFC', src: `${L}/kfc.svg`, color: '#A6093D' },
  petsmart: { name: 'PetSmart', wordmark: 'PetSmart', color: '#0072CE' },
  schick: { name: 'Schick', wordmark: 'Schick', color: '#005EB8' },
  conco: { name: 'ConCo', wordmark: 'ConCo', color: '#1a2233' },
}

/** Helper: pick a list of brands by key. */
export const pick = (...keys: string[]): BrandDef[] => keys.map((k) => BRANDS[k]).filter(Boolean)
