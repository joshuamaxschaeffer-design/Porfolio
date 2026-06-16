/**
 * Panda Express case study — content defaults.
 * Same pattern as the Baserate build: all copy lives here; the Payload block
 * only carries optional overrides. Outcomes stats are sourced from public
 * reporting (verified June 2026):
 *  - Apple App Store listing (4.8★, 574K ratings)
 *  - WWT × Panda Express case study (16M+ members, $1B+ member sales, Ipsos #1)
 *  - Nation's Restaurant News, June 2023 (delivery 3×+ since Panda Delivers, 2020)
 *  - Google Play listing (5M+ installs)
 */

export const overview = {
  client: 'Panda Express',
  dateRange: 'November 2019 — April 2022',
  lead: 'Working for Hathway from pitch to launch for 2 versions of the Panda Express App and marketing site.',
  role: 'Art Director + Product Lead',
  scope: [
    'Project Pitch',
    'Product Strategy',
    'Product UX',
    'Product UI',
    'Marketing UI + UX',
    'Presentations',
  ],
}

export const challenge = {
  heading: 'THE CHALLENGE',
  intro: 'An order placed on a phone has to be true in three places at once: the platform that takes it, the restaurant that cooks it, and the guest standing outside waiting on it. Most of the hard design work lived in that pipeline — making backend data, store operations, and the guest experience agree with each other in real time.',
  problems: [
    {
      tag: '01',
      title: 'One order, three systems',
      body: 'Menus, pricing, item availability, and order status originated in the backend, were acted on in the restaurant, and were promised to the guest. Every screen had to be designed around what each system actually knew — and when it knew it.',
    },
    {
      tag: '02',
      title: '2,300+ restaurants, each their own source of truth',
      body: 'Store hours, regional menus, sold-out items, kitchen throughput at peak. The UI had to absorb per-location variance without ever making the guest do the reconciling.',
    },
    {
      tag: '03',
      title: 'Zero margin for confusion',
      body: 'COVID made the order pipeline the business. Contactless pickup and delivery only work when the status a guest sees matches what the kitchen is doing — designing that trust was the job.',
    },
  ],
}

export const releases = {
  heading: '2020 PIVOT',
  intro:
    '2020 required a massive product pivot. Three months into UX discovery, mobile ordering became incredibly important. The new plan: a quick, minimal app in three months, followed by a full rewards app the following year.',
  phasesLabel: '2 PHASES',
  phasesIntro: 'Added brand differentiation to emphasize the value gain from the free to paid product.',
  mvp: {
    title: 'MVP FAST-LAUNCH',
    body: 'The fast launch emphasized core ordering and prioritized the web experience.',
  },
  /** Device-scatter band that follows the 2-card grid (Figma "MVP Section 3"). */
  scatter: {
    title: 'Seamless Simple Reordering',
    body: 'Designed every page to factor in the unique ordering style of Panda Express.',
  },
  rewards: {
    title: 'FULL REWARDS APP',
    body: 'The full set of features, a better native app experience, and the rewards functionality was added as a follow-up to the core app.',
  },
}

/* ─────────────────────────────────────────────────────────────────────────
 * MVP FAST-LAUNCH — Core UX (section 4)
 * The MVP shipped barebones ordering. Its UX was mapped as 4 core scenarios
 * that all converge on one checkout spine. Source of truth: the original UX
 * flow (Figma node 278:73643) — the four color-coded paths in that diagram are
 * reproduced here as selectable, step-by-step flows. `screen` selects which
 * simple vector mock the phone renders for that step.
 * ───────────────────────────────────────────────────────────────────────── */

/**
 * Modeled as a node/edge graph so the section can draw the WHOLE flow once
 * (like Joshua's original slides) and then light up ONE scenario's path at a
 * time over a dimmed diagram. Coordinates are in a normalized 12×5 grid
 * (col 0–11, row 0–4) laid out to echo the source flowchart: a checkout spine
 * across the middle (row 2.5) with promo/location branches above and the
 * category branch below.
 */

/** Glyph drawn inside a node's little phone (kept deliberately schematic). */
export type MvpGlyph =
  | 'home' | 'menu' | 'product' | 'bag' | 'checkout' | 'confirmation'
  | 'promo' | 'popup' | 'category' | 'quantity' | 'location' | 'productSel'

export interface MvpNode {
  id: string
  label: string
  glyph: MvpGlyph
  /** grid centre (col 0–11, row 0–4) */
  col: number
  row: number
}

export interface MvpEdge {
  from: string
  to: string
  /** pill label on the edge, e.g. "Tap a promo" */
  label?: string
  /** routing hint for the SVG connector */
  kind?: 'h' | 'v' | 'elbow-up' | 'elbow-down'
}

export interface MvpScenario {
  id: string
  title: string
  blurb: string
  /** ordered node ids the path visits */
  path: string[]
}

/** Shared spine — every scenario ends on these last three. */
const SPINE: MvpNode[] = [
  { id: 'home', label: 'Homepage', glyph: 'home', col: 0.5, row: 2.5 },
  { id: 'menu', label: 'Menu', glyph: 'menu', col: 2.7, row: 2.5 },
  { id: 'product', label: 'Product Page', glyph: 'product', col: 5.3, row: 2.5 },
  { id: 'bag', label: 'My Bag', glyph: 'bag', col: 7.8, row: 2.5 },
  { id: 'checkout', label: 'Checkout', glyph: 'checkout', col: 9.7, row: 2.5 },
  { id: 'confirmation', label: 'Confirmation', glyph: 'confirmation', col: 11.05, row: 2.5 },
]

export const mvp = {
  heading: 'MVP FAST-LAUNCH',
  intro:
    'The MVP was focused on streamlining barebones ordering, with other features like curbside pickup as a fast follow.',
  callout: {
    title: 'Core UX',
    body: 'The UX for ordering was mapped for 4 core scenarios, ensuring each scenario was simple and clear to the user.',
  },
  hint: 'Pick a scenario to trace its path — every one converges on the same checkout spine.',
  /** all nodes in the diagram (spine + branch nodes) */
  nodes: [
    ...SPINE,
    // promo branch (upper-left)
    { id: 'promoNotif', label: 'Item added to menu', glyph: 'promo', col: 1.6, row: 0.55 },
    // restaurant/handoff popup (upper-mid)
    { id: 'restaurant', label: 'Choose Restaurant', glyph: 'popup', col: 3.9, row: 1.15 },
    { id: 'productSel', label: 'Product, item selected', glyph: 'productSel', col: 5.3, row: 0.55 },
    // location branch (upper-right)
    { id: 'location', label: 'Location Page', glyph: 'location', col: 9.9, row: 0.7 },
    // category branch (lower-mid)
    { id: 'category', label: 'NomNom Category', glyph: 'category', col: 4.0, row: 3.95 },
    { id: 'quantity', label: 'Choose Quantity', glyph: 'quantity', col: 6.0, row: 3.95 },
  ] as MvpNode[],
  /** every directed edge in the diagram, with its pill label */
  edges: [
    // spine
    { from: 'home', to: 'menu', label: 'Scroll', kind: 'h' },
    { from: 'menu', to: 'product', label: 'Tap a product', kind: 'h' },
    { from: 'product', to: 'bag', label: 'Add product', kind: 'h' },
    { from: 'bag', to: 'checkout', label: 'Check out', kind: 'h' },
    { from: 'checkout', to: 'confirmation', label: 'Check out', kind: 'h' },
    // promo branch
    { from: 'home', to: 'promoNotif', label: 'Tap a promo', kind: 'elbow-up' },
    { from: 'promoNotif', to: 'productSel', label: 'Tap a product', kind: 'h' },
    { from: 'productSel', to: 'bag', label: 'Add product', kind: 'elbow-down' },
    // location / handoff branch
    { from: 'product', to: 'restaurant', label: 'No location set', kind: 'elbow-up' },
    { from: 'restaurant', to: 'product', label: 'Location selected', kind: 'elbow-down' },
    { from: 'bag', to: 'location', label: 'Change handoff', kind: 'elbow-up' },
    { from: 'location', to: 'bag', label: 'Continue', kind: 'elbow-down' },
    // category branch
    { from: 'menu', to: 'category', label: 'Tap a category', kind: 'elbow-down' },
    { from: 'category', to: 'quantity', label: 'Tap a product', kind: 'h' },
    { from: 'quantity', to: 'bag', label: 'Add product', kind: 'elbow-up' },
  ] as MvpEdge[],
  scenarios: [
    {
      id: 'promo',
      title: 'Add a promotion',
      blurb: 'Tap a featured promo on the homepage; the item is added and the order continues to checkout.',
      path: ['home', 'promoNotif', 'productSel', 'bag', 'checkout', 'confirmation'],
    },
    {
      id: 'product',
      title: 'Add a product',
      blurb: 'Scroll the homepage menu, open a dish, add it — the simplest path to checkout.',
      path: ['home', 'menu', 'product', 'bag', 'checkout', 'confirmation'],
    },
    {
      id: 'category',
      title: 'Add from a category',
      blurb: 'Open a menu category, set quantity in a popup, then send it to the bag.',
      path: ['menu', 'category', 'quantity', 'bag', 'checkout', 'confirmation'],
    },
    {
      id: 'location',
      title: 'Choose a location',
      blurb: 'When no store is set, a handoff popup resolves location before the order continues.',
      path: ['product', 'restaurant', 'product', 'bag', 'checkout', 'confirmation'],
    },
  ] as MvpScenario[],
}

export interface PandaStat {
  /** numeric target the count-up animates to */
  value: number
  /** decimal places to render during/after the count-up (default 0) */
  decimals?: number
  prefix?: string
  /** rendered in Panda red after the number, e.g. "M+" / "★" */
  suffix?: string
  label: string
  description: string
}

export const outcomes = {
  heading: 'OUTCOMES',
  lead: 'A platform born in a crisis became the backbone of Panda’s digital business. The app, the rewards program, and the site now carry a measurable share of one of America’s largest restaurant brands.',
  stats: [
    {
      value: 4.8,
      decimals: 1,
      suffix: '★',
      label: 'App Store Rating',
      description: 'Across 574,000+ ratings on iOS — sustained while the app scaled to millions of guests.',
    },
    {
      value: 16,
      suffix: 'M+',
      label: 'Rewards Members',
      description: 'Panda Rewards members since the program launched on the platform.',
    },
    {
      value: 1,
      prefix: '$',
      suffix: 'B+',
      label: 'Member Sales',
      description: 'In sales generated by Panda Rewards members through the digital experience.',
    },
    {
      value: 1,
      prefix: '#',
      label: 'Digital Ordering, US',
      description: 'Ranked first of 26 brands in Ipsos’ 2024 Digital Ordering Performance study — highest score overall and for app benefits.',
    },
    {
      value: 3,
      suffix: '×',
      label: 'Delivery Growth',
      description: 'Delivery business more than tripled after Panda Delivers launched through the app and site in 2020.',
    },
    {
      value: 5,
      suffix: 'M+',
      label: 'Android Installs',
      description: 'Google Play downloads, alongside the iOS install base that anchors the rating above.',
    },
  ] as PandaStat[],
  sources:
    'Sources: Apple App Store (2026) · WWT × Panda Express case study · Ipsos QSR Digital Ordering Performance Study, 2024 · Nation’s Restaurant News · Google Play (2026)',
}

/**
 * Component Libraries — second item inside the MVP Fast-Launch section.
 * Copy mirrors the Figma frame header (node 263:46908). Two flat artifact
 * sheets live in /public/panda/components/.
 */
export const componentLibraries = {
  title: 'COMPONENT LIBRARIES',
  body: 'Component libraries included everything from icons to larger, complex components, along with a consistent set of illustrative iconography.',
}
