/**
 * Capabilities — content defaults (FPO).
 *
 * This is a CASE-STUDY-STYLE scrolling page (not a grid): a hero/overview, then
 * one section per design discipline, each with copy, a client-logo row, and grey
 * placeholder media frames (device mockups / UX shots / artifacts) to be swapped
 * for real imagery later. Authoring pattern matches the other case studies
 * (panda/samsung data.ts): all copy lives here; the `capabilitiesPage` block
 * carries optional overrides.
 *
 * Copy below is FPO (for placement only) — real copy/media to come.
 *
 * Discipline set + client roster derived from Portfolio-Strategy.md
 * (§4.2 capabilities, §6.1 lifecycle/project lineup, §8.1 capability matrix).
 */

/** A single grey placeholder frame inside a section. */
export interface MediaSlot {
  /** label shown inside the dashed grey frame */
  label: string
  /** aspect ratio token → tailwind aspect class (see component map) */
  ratio?: 'wide' | 'video' | 'square' | 'portrait' | 'tall'
}

/** Layout variants so sections don't all look identical as you scroll. */
export type SectionLayout =
  | 'mediaRight' // copy left, single tall media right
  | 'mediaLeft' // single media left, copy right
  | 'stack' // copy, then a row of media below
  | 'trio' // copy, then 3 device frames in a row

export interface CapabilitySection {
  /** anchor id for the SectionNav rail */
  id: string
  /** two-digit ordinal */
  num: string
  /** discipline name (rail title + heading) */
  title: string
  /** FPO intro paragraph */
  intro: string
  /** the products / startups / clients this was shipped for */
  clients: string[]
  /** how this section arranges its media */
  layout: SectionLayout
  /** grey placeholder media frames */
  media: MediaSlot[]
}

export const overview = {
  eyebrow: 'Capabilities',
  /** \n marks the line break in the display heading */
  heading: 'Every stage of the\ndesign process.',
  lead:
    '[FPO] Most senior designers own one lane — product, or brand, or motion. Across 13 years I’ve shipped all of them, repeatedly, as a lead and art director. This page walks the full process discipline by discipline, with the products and brands each was built for.',
  role:
    '[FPO] Lead & Art Director across consumer apps, B2B platforms, and investor-facing products — strategy through shipped, shipped experience.',
  /** scope pills under the lead */
  scope: [
    'Strategy',
    'Product & UX',
    'Brand',
    'Design Systems',
    'Art Direction',
    'Motion',
    'Web',
    'AI Prototyping',
  ],
  /** wide hero placeholder */
  heroMedia: 'Hero montage — signature work across disciplines',
}

export const sections: CapabilitySection[] = [
  {
    id: 'strategy',
    num: '01',
    title: 'Strategy & Discovery',
    intro:
      '[FPO] Framing the real problem before a pixel moves — product direction, information architecture, and the decisions that set what gets built and why. Replace with a concrete example: the discovery work that reshaped a roadmap or unlocked a launch.',
    clients: ['Baserate', 'Journalytic', 'IPSE', 'Blaze', 'Samsung'],
    layout: 'mediaRight',
    media: [{ label: 'Strategy artifact — map / model / flow', ratio: 'portrait' }],
  },
  {
    id: 'product-ux',
    num: '02',
    title: 'Product & UX Design',
    intro:
      '[FPO] End-to-end app design: flows, interaction, and interfaces for consumer apps at scale and dense B2B tools alike. Replace with a flagship flow — ordering, rewards, or a power-user workflow — shown across a few key screens.',
    clients: ['Panda Express', 'Wingstop', 'Raising Cane’s', 'Mindbody', 'Baserate', 'CBTL', 'Journalytic'],
    layout: 'trio',
    media: [
      { label: 'App screen — primary flow', ratio: 'portrait' },
      { label: 'App screen — detail', ratio: 'portrait' },
      { label: 'App screen — state', ratio: 'portrait' },
    ],
  },
  {
    id: 'brand',
    num: '03',
    title: 'Brand Systems & Identity',
    intro:
      '[FPO] Full identity systems — logo, type, color, and voice — built to scale across product and marketing, not just a logo file. Replace with a brand board and one or two applications that show the system in use.',
    clients: ['Baserate', 'Journalytic', 'Blaze', 'IPSE', 'Trees', 'Rosetta'],
    layout: 'mediaLeft',
    media: [{ label: 'Brand board — logo / type / color', ratio: 'wide' }],
  },
  {
    id: 'design-systems',
    num: '04',
    title: 'Design Systems & Implementation',
    intro:
      '[FPO] Component libraries, tokens, and the developer handoff that keeps a product consistent as the team and surface area grow. Replace with a components sheet and a token / handoff artifact.',
    clients: ['Baserate', 'Mindbody', 'Panda Express', 'Wingstop', 'Samsung'],
    layout: 'stack',
    media: [
      { label: 'Component library', ratio: 'video' },
      { label: 'Tokens / handoff spec', ratio: 'video' },
    ],
  },
  {
    id: 'art-direction',
    num: '05',
    title: 'Art Direction',
    intro:
      '[FPO] Setting the visual hypothesis and holding it across every surface — directing other designers, photography, and campaigns. Replace with a campaign key visual and a couple of directed executions.',
    clients: ['Wingstop', 'Panda Express', 'Samsung', 'Raising Cane’s'],
    layout: 'mediaRight',
    media: [{ label: 'Campaign key visual', ratio: 'portrait' }],
  },
  {
    id: 'motion',
    num: '06',
    title: 'Motion & Interaction',
    intro:
      '[FPO] Motion as comprehension, not decoration — working prototypes, interface motion, and explainer video that sells the idea. Replace with a looping prototype clip and stills from an explainer.',
    clients: ['Baserate', 'Panda Express', 'Wingstop'],
    layout: 'mediaLeft',
    media: [{ label: 'Motion / prototype clip', ratio: 'video' }],
  },
  {
    id: 'web',
    num: '07',
    title: 'Marketing & Web Design',
    intro:
      '[FPO] Launch and product sites that wrap the app — brand storytelling and conversion built into one responsive experience. Replace with a desktop + mobile web layout pairing.',
    clients: ['Samsung', 'Panda Express', 'Pepsi', 'Chandon', 'Dairy Queen', 'KFC'],
    layout: 'stack',
    media: [
      { label: 'Marketing site — desktop', ratio: 'wide' },
      { label: 'Marketing site — mobile', ratio: 'tall' },
    ],
  },
  {
    id: 'ai-prototyping',
    num: '08',
    title: 'AI Product Prototyping',
    intro:
      '[FPO] Designing and building with AI in the loop — pairing with models to prototype, ship, and pressure-test product ideas fast. Replace with a prototype-over-tool shot and a before/after.',
    clients: ['Baserate', 'Journalytic'],
    layout: 'mediaRight',
    media: [{ label: 'AI prototyping — UI over tool', ratio: 'portrait' }],
  },
]

/** small print under the lead */
export const note =
  '[FPO] Selected clients shown per discipline. Many projects span several categories.'
