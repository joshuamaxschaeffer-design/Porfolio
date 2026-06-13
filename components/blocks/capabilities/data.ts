/**
 * Capabilities page — content defaults.
 *
 * Same authoring pattern as the case studies (panda/data.ts): all copy lives
 * here; the Payload `capabilitiesPage` block only carries optional overrides.
 *
 * The page is organized BY DESIGN DISCIPLINE (not by project) to communicate
 * one thing to a senior buyer: Joshua has shipped every stage of the design
 * process — strategy, brand, product, systems, motion, art direction, web, and
 * AI prototyping — for named, recognizable companies. Each discipline lists the
 * products/clients that work was done for, so breadth and proof read together.
 *
 * Project roster + discipline grouping derived from Portfolio-Strategy.md
 * (§4.2 capabilities list, §6.1 lifecycle/project lineup, §8.1 capability matrix).
 */

export interface CapabilityCategory {
  /** two-digit ordinal shown in the corner of the card */
  num: string
  /** discipline name */
  title: string
  /** one-line statement of the capability, operator-coded, no jargon */
  blurb: string
  /** the products / startups / clients this was shipped for */
  clients: string[]
}

export const intro = {
  eyebrow: 'Capabilities',
  /** the page H1 (\n marks the line break in the display heading) */
  heading: 'Every stage of the\ndesign process.',
  /** positioning paragraph under the heading */
  lead:
    'Most senior designers own one lane — product, or brand, or motion. Across 13 years I’ve shipped all of them, repeatedly, as a lead and art director. Below is the full process, grouped by discipline, with the products and brands each was built for.',
  /** small print under the lead */
  note: 'Selected clients shown per discipline. Many projects span several categories.',
}

export const categories: CapabilityCategory[] = [
  {
    num: '01',
    title: 'Strategy & Discovery',
    blurb:
      'Framing the real problem before a pixel moves — product direction, IA, and the decisions that set what gets built and why.',
    clients: ['Baserate', 'Journalytic', 'IPSE', 'Blaze', 'Samsung'],
  },
  {
    num: '02',
    title: 'Product & UX Design',
    blurb:
      'End-to-end app design: flows, interaction, and interfaces for consumer apps at scale and dense B2B tools alike.',
    clients: [
      'Panda Express',
      'Wingstop',
      'Raising Cane’s',
      'Mindbody',
      'Baserate',
      'CBTL',
      'Journalytic',
    ],
  },
  {
    num: '03',
    title: 'Brand Systems & Identity',
    blurb:
      'Full identity systems — logo, type, color, and voice — built to scale across product and marketing, not just a logo file.',
    clients: ['Baserate', 'Journalytic', 'Blaze', 'IPSE', 'Trees', 'Rosetta'],
  },
  {
    num: '04',
    title: 'Design Systems & Implementation',
    blurb:
      'Component libraries, tokens, and the developer handoff that keeps a product consistent as the team and surface area grow.',
    clients: ['Baserate', 'Mindbody', 'Panda Express', 'Wingstop', 'Samsung'],
  },
  {
    num: '05',
    title: 'Art Direction',
    blurb:
      'Setting the visual hypothesis and holding it across every surface — directing other designers, photography, and campaigns.',
    clients: ['Wingstop', 'Panda Express', 'Samsung', 'Raising Cane’s'],
  },
  {
    num: '06',
    title: 'Motion & Interaction',
    blurb:
      'Motion as comprehension, not decoration — working prototypes, interface motion, and explainer video that sells the idea.',
    clients: ['Baserate', 'Panda Express', 'Wingstop'],
  },
  {
    num: '07',
    title: 'Marketing & Web Design',
    blurb:
      'Launch and product sites that wrap the app — brand storytelling and conversion built into one responsive experience.',
    clients: ['Samsung', 'Panda Express', 'Pepsi', 'Chandon', 'Dairy Queen', 'KFC'],
  },
  {
    num: '08',
    title: 'AI Product Prototyping',
    blurb:
      'Designing and building with AI in the loop — pairing with models to prototype, ship, and pressure-test product ideas fast.',
    clients: ['Baserate', 'Journalytic'],
  },
]
