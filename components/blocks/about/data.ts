/**
 * About page — content.
 *
 * Rewritten 2026-06-13 to be ruthless and targeted (per Joshua): one claim,
 * three differentiators, the proof timeline, one close. No capability matrix,
 * no separate principles list, no personal-hook paragraph, no résumé dump —
 * those scattered the page. The three differentiators ARE the page.
 *
 * The three were chosen by Joshua as his sharpest separators for the buyers he
 * wants (founders, design leaders, fintech/enterprise, family offices):
 *   1. Product + brand in one person  (the core moat)
 *   2. Investor-grade / high-trust work
 *   3. Owns the whole design function (operator, not just a maker)
 * Consumer scale (Panda/Wingstop/Cane's) stays as PROOF in the timeline, not as
 * a headline claim.
 *
 * Tone: declarative, specific, operator-coded (strategy §10.2). Leadership is
 * worded as FUNCTION OWNERSHIP, never "managed a team" (reference-call firewall,
 * strategy §8.1 + locked memory). No /resume.pdf or /personal links (per Joshua).
 */

export interface Differentiator {
  /** two-digit ordinal */
  num: string
  /** the claim, as a tight headline */
  title: string
  /** one sentence of proof — names, not adjectives */
  body: string
}

export interface TimelineEntry {
  company: string
  role: string
  years: string
  /** one operator-coded line */
  note: string
}

export const intro = {
  eyebrow: 'Joshua Schaeffer',
  /** the one claim (\n = display line break) */
  heading: 'I design the product\nand the brand.',
  /** one short paragraph — the whole "bio", said once */
  lead:
    'Thirteen years shipping both, as a lead and an art director — for Samsung, Panda Express, Wingstop, Mindbody, and most recently as Head of Design for the investor products Journalytic and Baserate.',
}

/** The three differentiators. This is the spine of the page. */
export const differentiators: Differentiator[] = [
  {
    num: '01',
    title: 'Product and brand, one person.',
    body: 'Most senior designers own one lane. I ship product, brand, motion, and the marketing site as a single engagement — fewer vendors, faster, and each one makes the others sharper.',
  },
  {
    num: '02',
    title: 'Built for high-trust products.',
    body: 'I designed Baserate for investors — the same people writing the checks — so I design for clarity and trust under real stakes, not delight for its own sake. The kind of work fintech and enterprise are judged on.',
  },
  {
    num: '03',
    title: 'I own the whole function.',
    body: 'As Head of Design I owned product direction, UX, brand, and marketing end to end, in lockstep with the CEO and lead engineer. An operator who ships, not a maker who waits for a brief.',
  },
]

/** Proof. The timeline animates in; copy stays minimal. */
export const timeline: TimelineEntry[] = [
  {
    company: 'Journalytic · Baserate',
    role: 'Head of Design',
    years: '2023 — Now',
    note: 'Owned design end to end for two investor products — product, brand, site, and explainer film. The work helped close the round.',
  },
  {
    company: 'Hathway / Bounteous',
    role: 'Lead Designer → Art Director',
    years: '2018 — 2023',
    note: 'Led and art-directed the apps for Panda Express, Wingstop, Raising Cane’s, and CBTL — used daily at national scale.',
  },
  {
    company: 'Mindbody',
    role: 'UI / Interaction Designer',
    years: '2017 — 2018',
    note: 'B2B at depth — power-user workflows and cross-product consistency on a multi-product platform.',
  },
  {
    company: 'Samsung · Razorfish',
    role: 'Designer',
    years: '2013 — 2017',
    note: 'Enterprise design at global scale. Where I learned systems, brand consistency, and how to ship inside a large org.',
  },
]

/** One close. CTA only — no side-projects link, no CV link. */
export const outro = {
  line: 'Open to senior product, brand, and design-lead engagements.',
  ctaLabel: 'Get in touch',
  ctaHref: '/contact',
}
