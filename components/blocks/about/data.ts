/**
 * About page — content defaults.
 *
 * Same authoring pattern as the case studies (panda/data.ts) and the
 * capabilities page: all copy lives here as plain data; the page component is
 * presentation only. No Payload block yet — the About route renders this
 * directly — but keeping content here means it's trivial to wire CMS overrides
 * later without touching layout.
 *
 * Positioning, story beats, capability split, leadership framing, and the
 * philosophy lines are derived from Portfolio-Strategy.md:
 *   §1.2  — personal-site positioning ("Product + Brand Design Lead …")
 *   §8.1  — what the About page must include (story, capability matrix,
 *           philosophy, leadership framing, personal hook, side-projects link)
 *   §8.2  — what to leave off (chronological résumé, skill bars, "passionate")
 *   §10.2 — tone of voice (declarative, specific, operator-coded, no jargon)
 *
 * Leadership wording is deliberate: "owned the design function," NEVER
 * "managed a team" — Joshua had no direct reports, and that phrasing keeps the
 * claim airtight on a reference call (per strategy §8.1 + locked memory).
 */

export interface CapabilityGroup {
  /** heading for the column */
  heading: string
  /** the disciplines / things under it */
  items: string[]
}

export interface TimelineEntry {
  /** company / org */
  company: string
  /** role held there */
  role: string
  /** year range, e.g. "2021–2024" */
  years: string
  /** one operator-coded line on what the work was */
  note: string
}

export interface PrincipleEntry {
  title: string
  body: string
}

export const intro = {
  eyebrow: 'About',
  /** the page H1 — the personal-site positioning, stated plainly */
  heading: 'Product + Brand\nDesign Lead.',
  /** the standfirst directly under the H1 */
  lead:
    'I build high-trust digital experiences — product and brand together — for consumer apps at scale and the serious B2B and fintech tools investors actually evaluate.',
}

/**
 * The three-paragraph story (strategy §8.1: "a story, not a bio").
 * Specific names, specific outcomes, declarative. Each string is one paragraph.
 */
export const story: string[] = [
  'I’ve spent 13 years as a designer who ships the whole thing. I started inside one of the largest enterprise design programs in the world — Samsung, through Razorfish/Publicis-Sapient — where I learned how brand consistency, systems, and craft hold up at a scale most designers never touch.',
  'From there I moved into consumer product, leading and art-directing the apps behind brands people use every day — Panda Express, Wingstop, Raising Cane’s, and The Coffee Bean & Tea Leaf at Hathway (now Bounteous) — then into dense B2B at Mindbody, where the job isn’t delight in twelve seconds, it’s not breaking a power user’s workflow. Most senior designers own one lane: product, or brand, or motion. I’ve shipped all of them, repeatedly, as a lead and an art director.',
  'Most recently I owned the design function end to end for Journalytic and Baserate — investor-facing products built for the same people writing the checks. Product direction, UX systems, branding, the marketing site, and the explainer video: one operator, the full stack. I partnered directly with the CEO and lead engineer on what we built and how it worked, and the design helped the founders close their round.',
]

/**
 * Capability matrix (strategy §8.1): "what you do" vs "what you partner for."
 * Keeps the breadth claim honest — naming what's brought in (engineering,
 * illustration at scale, paid media) reads as senior, not as overreach.
 * Discipline names mirror components/blocks/capabilities/data.ts so the two
 * pages stay consistent.
 */
export const capabilities = {
  /** the lead-in line above the two columns */
  intro:
    'One designer, the full product-and-brand stack. Here’s what I own end to end — and what I bring partners in for, because pretending to do everything is how quality slips.',
  own: {
    heading: 'What I own',
    items: [
      'Product & UX Design',
      'Brand Systems & Identity',
      'Strategy & Discovery',
      'Design Systems & Implementation',
      'Art Direction',
      'Motion & Interaction',
      'Marketing & Web Design',
      'AI Product Prototyping',
    ],
  } as CapabilityGroup,
  partner: {
    heading: 'What I partner for',
    items: [
      'Front-end & full-stack engineering',
      'Illustration at scale',
      'Paid media & performance',
      'Photography & production',
    ],
  } as CapabilityGroup,
}

/**
 * Leadership note (strategy §8.1). Framed as FUNCTION OWNERSHIP, not headcount.
 */
export const leadership = {
  heading: 'Leadership',
  body:
    'I’ve led as an Art Director at Hathway/Bounteous — setting the visual hypothesis and holding it across the app and connected marketing, directing other designers’ work — and as the Head of Design for Journalytic and Baserate, where I owned the design function end to end: product direction, UX systems, branding, and marketing, in lockstep with the CEO and lead engineer. I screen for judgment over polish, and I’ve mentored designers on how to make calls, not just pixels.',
}

/**
 * A compact, scannable history. NOT a résumé (the CV PDF does that, per §8.2) —
 * just enough to anchor the named brands to roles and years for a buyer skimming
 * for "what level is this person."
 */
export const timeline: TimelineEntry[] = [
  {
    company: 'Journalytic · Baserate',
    role: 'Head of Design',
    years: '2023–Present',
    note: 'Owned the design function end to end for two investor-facing products — product, brand, marketing site, and explainer video.',
  },
  {
    company: 'Hathway (now Bounteous)',
    role: 'Lead Designer → Art Director',
    years: '2018–2023',
    note: 'Led and art-directed the apps for Panda Express, Wingstop, Raising Cane’s, and CBTL — consumer products used daily at national scale.',
  },
  {
    company: 'Mindbody',
    role: 'UI / Interaction Designer',
    years: '2017–2018',
    note: 'B2B product design at depth — power-user workflows and cross-product consistency on a multi-product platform.',
  },
  {
    company: 'Samsung · Razorfish / Publicis-Sapient',
    role: 'Designer',
    years: '2013–2017',
    note: 'Enterprise marketing and web design inside one of the largest design programs in the world. Where I learned systems and scale.',
  },
]

/**
 * Philosophy (strategy §8.1: "2–3 sentences, specific, not human-centered
 * mush"). These three read as principles a senior buyer can pre-qualify on.
 */
export const principles: PrincipleEntry[] = [
  {
    title: 'I design like an operator.',
    body: 'Ship dates, budgets, and outcomes — not "experiences" and "journeys." The work is judged by what it does, not how it’s described.',
  },
  {
    title: 'Brand is a feature.',
    body: 'Product and brand aren’t two engagements handed to two vendors. Built together by one person, they reinforce each other instead of fighting.',
  },
  {
    title: 'Polish is leverage.',
    body: 'Clarity builds trust, especially in high-stakes interfaces where someone is moving money or making a call. Restraint is the senior move.',
  },
]

/**
 * Personal hook (strategy §8.1, "optional, one sentence, humanizes").
 */
export const personal = {
  body:
    'I’m based on California’s Central Coast in San Luis Obispo. Outside the work I’m usually building something — lately, pairing with AI to prototype faster than I have any right to.',
}

/**
 * Closing CTA + the discreet side-projects link (strategy §8.1: side projects
 * live here at the bottom, not on the homepage — "charm, not credibility").
 */
export const outro = {
  ctaText: 'Currently open to senior product design, brand systems, and strategic engagements.',
  ctaLabel: 'Start a conversation',
  ctaHref: '/contact',
  sideProjectsLabel: 'Side projects',
  sideProjectsHref: '/personal',
}
