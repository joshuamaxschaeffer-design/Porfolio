/**
 * About page — content.
 *
 * Voice (per Joshua): value-first, not "I"-first. Not a personal blog — a case
 * for the value delivered. Minimal first-person; lead with the work and the
 * outcome. Where there's a defensible, sourced number, it lives INLINE in the
 * role's sentence (not a set-off metric block — that read as weak). Numbers are
 * reconciled with the live case studies, which carry their public sources.
 *
 * Honesty firewall: the Journalytic/Baserate role is "led / owned the design
 * function," never "managed a team" (no direct reports — reference-call safe,
 * strategy §8.1 + locked memory). Hathway genuinely led a small team, so "led
 * and art-directed" is accurate there.
 *
 * Three differentiators (Joshua's pick): product+brand in one person /
 * high-trust (investor-grade) work / owns the whole function.
 */

export interface Differentiator {
  num: string
  title: string
  body: string
}

export interface TimelineEntry {
  company: string
  role: string
  years: string
  /** one value-framed line — what the work delivered (proof woven in) */
  note: string
}

export const intro = {
  eyebrow: 'About',
  /** the one claim (\n = display line break) — value, not ego */
  heading: 'Product and brand,\nbuilt by one operator.',
  /** one short paragraph; agentless, value-framed */
  lead:
    'Thirteen years shipping both — product design and brand — for Samsung, Panda Express, Wingstop, Mindbody, and the investor products Journalytic and Baserate. One engagement instead of three vendors, from first principle to launch.',
}

/** The three differentiators — framed as value to the buyer, not traits. */
export const differentiators: Differentiator[] = [
  {
    num: '01',
    title: 'One operator, the whole stack.',
    body: 'Product, brand, motion, and the marketing site ship as a single engagement — fewer vendors to coordinate, faster to launch, and a product and brand that actually agree with each other.',
  },
  {
    num: '02',
    title: 'Made for high-trust products.',
    body: 'Baserate was designed for the investors writing the checks. The result reads for clarity and trust under real stakes — the bar fintech, enterprise, and serious B2B are measured against.',
  },
  {
    num: '03',
    title: 'Owns the function, not just the file.',
    body: 'As Head of Design: product direction, UX, brand, and marketing owned end to end, in lockstep with the CEO and lead engineer. Strategy through shipped product — not concepts waiting on a brief.',
  },
]

/**
 * The path. Clean cards — year / company / role / one line. The proof (numbers,
 * outcomes) is woven into each note rather than set off in a metric block.
 */
export const timeline: TimelineEntry[] = [
  {
    company: 'Journalytic · Baserate',
    role: 'Head of Design',
    years: '2023 — Now',
    note: 'Owned design end to end for two investor products — brand, product, marketing site, and explainer film. The work helped the founders close their seed round.',
  },
  {
    company: 'Hathway / Bounteous',
    role: 'Lead Designer · Art Director',
    years: '2018 — 2023',
    note: 'Led design on the Panda Express and Wingstop apps — 4.8–4.9★, millions of reviews, 16M+ rewards members, and a digital channel that grew to 70% of sales. Plus Raising Cane’s and CBTL.',
  },
  {
    company: 'Mindbody',
    role: 'UI · Interaction Designer',
    years: '2017 — 2018',
    note: 'Power-user workflows and cross-product consistency for a multi-product platform serving tens of thousands of wellness businesses — density without breaking the expert.',
  },
  {
    company: 'Samsung · Razorfish',
    role: 'Designer',
    years: '2013 — 2017',
    note: 'Launch pages, social, and in-store UI for the world’s #1 smartphone maker — eight flagship Galaxy launches, each designed under pre-announcement NDA for a global day-one audience.',
  },
]

/** One close — availability, framed as what's on offer. */
export const outro = {
  line: 'Available for senior product, brand, and design-lead engagements.',
  ctaLabel: 'Start a project',
  ctaHref: '/contact',
}
