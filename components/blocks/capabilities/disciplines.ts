/**
 * Capabilities v3 — discipline content (the CENTERPIECE rebuild).
 *
 * The Capabilities section is the biggest, most-impressive section on the site:
 * it holds everything outside the 4 case studies (Panda + Baserate flagships;
 * Wingstop + Samsung secondary). Five merged disciplines + a closing Leadership
 * band. Each discipline opens with an overview (positioning + capability list +
 * count-up stat row), then its work modules.
 *
 * Structure + stats per:
 *   - `Capabilities Section — Design Strategy & Module Plan.md`
 *   - `Figma Project Catalogue.md` (work assignment, all shareable, roles confirmed)
 *   - sourced outcome stats (SEC filings, app stores, press — date-stamped)
 *
 * Stats discipline: every app-store number is a dated snapshot (they drift).
 * Volume stats are computed from the Figma catalogue and are defensible today.
 */

import type { StatItem } from '../shared/StatCounters'
import type { CapabilityItem } from './DisciplineModule'

export interface Discipline {
  id: string
  num: string
  title: string
  positioning: string
  capabilities: CapabilityItem[]
  stats: StatItem[]
  statsNote?: string
}

/** Section-level hero stat row (top of the whole Capabilities centerpiece). */
export const heroStats: StatItem[] = [
  { value: 13, suffix: '+', label: 'Years shipping product & brand' },
  { value: 20, suffix: '+', label: 'Brands across consumer & B2B' },
  { value: 4, label: 'Form factors — kiosk · mobile · native · desktop' },
  { value: 4500, suffix: '+', label: 'Reusable components authored' },
]

export const heroCopy = {
  eyebrow: 'Capabilities',
  heading: 'Product, brand, and\neverything between.',
  lead:
    'Most senior designers own one lane. Across 13 years I’ve shipped product, brand, design systems, art direction, and the web around them — repeatedly, as a Lead and Art Director. Here’s the full range, discipline by discipline, with the products and brands each was built for.',
  statsNote:
    'App-store figures are dated snapshots (June 2026); volume figures from project archives.',
}

/* ───────────────────────────────────────────────────────────────────────────
 * 01 — PRODUCT & UX DESIGN
 * Message: I ship real products at both ends of the spectrum — consumer apps
 * used by millions AND dense B2B tools that can't break power users.
 * Anchors: Mindbody (B2B), Raising Cane's (consumer).
 * ─────────────────────────────────────────────────────────────────────────── */
export const productUx: Discipline = {
  id: 'product-ux',
  num: '01',
  title: 'Product & UX Design',
  positioning:
    'I take products from the real problem to shipped flows — consumer apps ordered by millions and dense B2B tools that can’t afford to break a power user.',
  capabilities: [
    { label: 'Product strategy', note: 'Framing the problem before a pixel moves' },
    { label: 'Information architecture', note: 'Sitemaps, flows, permissions models' },
    { label: 'End-to-end app UX', note: 'Onboarding → ordering → loyalty → account' },
    { label: 'Multi-surface', note: 'Kiosk, mobile web, native, desktop' },
    { label: 'B2B / power-user workflows', note: 'POS, checkout, reconciliation, reporting' },
    { label: 'Ordering & loyalty systems', note: 'Cart, rewards, scan, group ordering' },
  ],
  stats: [
    { value: 11, label: 'Brands shipped in this discipline' },
    { value: 4, label: 'Form factors designed for' },
    { value: 9300, suffix: '+', label: 'Product screens designed' },
    { value: 4.8, decimals: 1, suffix: '★', label: 'Panda Express app — App Store (574K ratings)' },
  ],
  statsNote:
    'Panda ranked #1 of 26 QSR brands for digital ordering (Ipsos, 2024). Raising Cane’s app 4.9★ (385K ratings).',
}

/* ───────────────────────────────────────────────────────────────────────────
 * 02 — BRAND & IDENTITY
 * Message: I build complete identity systems, not logos — and I'm one of the few
 * product designers who genuinely does both.
 * Anchors: Blaze (authored multi-sub-brand system), True Food Kitchen (applied).
 * ─────────────────────────────────────────────────────────────────────────── */
export const brand: Discipline = {
  id: 'brand',
  num: '02',
  title: 'Brand & Identity',
  positioning:
    'Complete identity systems — logo, type, color, and voice — built to scale across product and marketing. Not a logo file; a system that holds together everywhere it lands.',
  capabilities: [
    { label: 'Identity systems', note: 'Logo, logotype, clearspace, usage' },
    { label: 'Type & color systems', note: 'Scales, tokens, accessible palettes' },
    { label: 'Sub-brand architecture', note: 'Product families under one system' },
    { label: 'Brand voice', note: 'Tone that carries from app to OOH' },
    { label: 'Logomark construction', note: 'Grids, anatomy, optical balance' },
    { label: 'Brand-in-product', note: 'Identity applied across real screens' },
  ],
  stats: [
    { value: 6, label: 'Identities built from scratch' },
    { value: 6, label: 'Marks in the Blaze sub-brand system' },
    { value: 11, label: 'Brands styled across product & web' },
    { value: 13, suffix: '+', label: 'Years building brand systems' },
  ],
  statsNote:
    'Authored identities: Blaze (+ 5 sub-brands), DOPA, Jubilee, Rosetta, Trees, plus Baserate / Journalytic.',
}

/* ───────────────────────────────────────────────────────────────────────────
 * 03 — DESIGN SYSTEMS & IMPLEMENTATION (+ data-viz)
 * Message: I think in systems — components, tokens, handoff, and the data-dense
 * patterns behind analytics tools.
 * Anchors: Mindbody (systems + data-viz), Baserate (library/tokens/handoff).
 * ─────────────────────────────────────────────────────────────────────────── */
export const designSystems: Discipline = {
  id: 'design-systems',
  num: '03',
  title: 'Design Systems & Implementation',
  positioning:
    'The components, tokens, and handoff that keep a product consistent as the team and surface area grow — including the data-dense patterns behind analytics and reporting.',
  capabilities: [
    { label: 'Component libraries', note: '300–800-component systems per product' },
    { label: 'Design tokens', note: 'Color, type, spacing as decisions' },
    { label: 'Developer handoff', note: 'Specs, redlines, design-to-code' },
    { label: 'Cross-surface consistency', note: 'One system, every form factor' },
    { label: 'Data-viz & dashboards', note: 'Charts, metrics, executive + analyst views' },
    { label: 'Iconography', note: 'UI glyph sets at scale' },
  ],
  stats: [
    { value: 4500, suffix: '+', label: 'Components authored across libraries' },
    { value: 447, label: 'Largest single library (Raising Cane’s)' },
    { value: 4, label: 'Form factors kept consistent' },
    { value: 11, label: 'Product systems contributed to' },
  ],
  statsNote:
    'Includes a documented data-viz pattern system and icon / illustration / motion languages for Mindbody.',
}

/* ───────────────────────────────────────────────────────────────────────────
 * 04 — ART DIRECTION & MOTION
 * Message: I set the visual hypothesis and make it move — and I've defined entire
 * visual languages, not just one-off assets.
 * Anchors: CBTL (watercolor AD), Mindbody (illustration + motion languages).
 * ─────────────────────────────────────────────────────────────────────────── */
export const artMotion: Discipline = {
  id: 'art-motion',
  num: '04',
  title: 'Art Direction & Motion',
  positioning:
    'Setting the visual hypothesis and making it move — campaigns, illustration systems, and interface motion. I’ve defined entire visual languages, not just one-off assets.',
  capabilities: [
    { label: 'Art direction', note: 'The visual hypothesis, held across surfaces' },
    { label: 'Illustration systems', note: 'A documented, reusable style' },
    { label: 'Interface motion', note: 'Transitions, feedback, choreography' },
    { label: 'Brand film & video', note: '4K product and brand films' },
    { label: 'Campaign visuals', note: 'Photography direction, key art' },
    { label: 'Animated identity', note: 'Logo systems in motion' },
  ],
  stats: [
    { value: 2, label: 'Visual languages defined (illustration + motion)' },
    { value: 5, label: 'Brands art-directed' },
    { value: 4, suffix: 'K', label: 'Brand films produced (CBTL)' },
    { value: 13, suffix: '+', label: 'Years directing visual work' },
  ],
  statsNote:
    'Documented “2 Pillars of Illustration” + “3 Pillars of Motion” languages (Mindbody); watercolor art direction (CBTL).',
}

/* ───────────────────────────────────────────────────────────────────────────
 * 05 — MARKETING & WEB (+ CRM/lifecycle)
 * Message: I design the whole journey — responsive launch/product sites plus the
 * lifecycle creative around them.
 * Anchors: True Food Kitchen (web), Blaze (marketing site).
 * ─────────────────────────────────────────────────────────────────────────── */
export const marketingWeb: Discipline = {
  id: 'marketing-web',
  num: '05',
  title: 'Marketing & Web',
  positioning:
    'Launch and product sites that wrap the app — plus the lifecycle creative around them. Brand storytelling and conversion built into one responsive experience.',
  capabilities: [
    { label: 'Marketing & launch sites', note: 'Homepage → conversion' },
    { label: 'Product / ordering web', note: 'Full responsive ordering flows' },
    { label: 'Responsive systems', note: 'Desktop, tablet, mobile' },
    { label: 'Email & lifecycle', note: 'Retention programs, not one-off mailers' },
    { label: 'Campaign / promo', note: 'Seasonal, LTO, drops' },
    { label: 'E-commerce / AR', note: 'Shoppable, interactive surfaces' },
  ],
  stats: [
    { value: 3, label: 'Responsive breakpoints, every build' },
    { value: 8, label: 'Brands with web / marketing work' },
    { value: 1, label: 'Full email & lifecycle program (Dairy Queen)' },
    { value: 13, suffix: '+', label: 'Years shipping responsive web' },
  ],
  statsNote:
    'True Food Kitchen drove 30%+ of off-premise sales through online ordering within a quarter of launch (Olo).',
}

/* ───────────────────────────────────────────────────────────────────────────
 * 06 — LEADERSHIP & CRAFT (closing band, not a full discipline)
 * Message: I don't just execute — I define languages, pitch them, mentor, and
 * build with AI.
 * ─────────────────────────────────────────────────────────────────────────── */
export const leadership: Discipline = {
  id: 'leadership',
  num: '06',
  title: 'Leadership & How I Work',
  positioning:
    'I don’t just execute. I define the visual languages, pitch them to the room, set the systems other designers extend, and build with AI in the loop.',
  capabilities: [
    { label: 'Design leadership', note: 'Lead → Art Director → Head of Design' },
    { label: 'Internal advocacy', note: 'Pitched the Mindbody illustration program' },
    { label: 'Systems other teams extend', note: 'Toolkits built for handoff' },
    { label: 'AI product prototyping', note: 'Building with models in the loop' },
  ],
  stats: [
    { value: 13, suffix: '+', label: 'Years, Lead → Art Director → Head of Design' },
    { value: 2, label: 'Visual languages defined & pitched' },
    { value: 20, suffix: '+', label: 'Brands led design across' },
    { value: 1, label: 'Investor-grade product built with AI (Baserate)' },
  ],
}

/** Ordered list the page iterates over (Leadership band rendered separately). */
export const disciplines: Discipline[] = [
  productUx,
  brand,
  designSystems,
  artMotion,
  marketingWeb,
]
