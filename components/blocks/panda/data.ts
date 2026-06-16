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
  | 'handoff'

export interface MvpNode {
  id: string
  label: string
  glyph: MvpGlyph
  /** grid centre (col 0–11, row 0–4) */
  col: number
  row: number
  /** where the text label sits relative to the phone tile (default 'below') */
  labelPos?: 'below' | 'above' | 'left' | 'right'
}

export interface MvpEdge {
  from: string
  to: string
  /** pill label on the edge, e.g. "Tap a promo" */
  label?: string
  /** optional second pill chained along the same edge (e.g. "Location preselected") */
  label2?: string
  /**
   * routing hint for the SVG connector. 'return' draws a long routed line that
   * drops below the diagram and runs back (used for the "Add more" /
   * "Will send to scrolled location" loops).
   */
  kind?: 'h' | 'h-low' | 'v' | 'elbow-up' | 'elbow-down' | 'return' | 'low-rail'
  /** dashed + lower-emphasis: a conditional/alternate branch, not the happy path */
  alt?: boolean
  /**
   * perpendicular lane offset (viewBox units) so a back-and-forth pair rides
   * two parallel lines instead of overlapping: horizontal edges shift up(-)/
   * down(+); elbow edges shift their vertical run left(-)/right(+).
   */
  off?: number
  /**
   * explicit Y for an elbow's horizontal run, so opposing edges can turn at
   * different heights (avoids overlapping turns). Auto-computed when omitted.
   */
  rail?: number
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
  { id: 'home', label: 'Homepage', glyph: 'home', col: 0.45, row: 2.6 },
  { id: 'menu', label: 'Menu', glyph: 'menu', col: 2.45, row: 2.6 },
  { id: 'product', label: 'Product Page', glyph: 'product', col: 5.15, row: 2.6 },
  { id: 'bag', label: 'My Bag', glyph: 'bag', col: 7.95, row: 2.6 },
  { id: 'checkout', label: 'Checkout', glyph: 'checkout', col: 9.55, row: 2.6 },
  { id: 'confirmation', label: 'Confirmation', glyph: 'confirmation', col: 11.1, row: 2.6 },
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
  /** all nodes in the diagram (spine + branch nodes), 1:1 with Figma 278:73643 */
  nodes: [
    ...SPINE,
    // promo branch (upper-left)
    { id: 'promoNotif', label: 'Item added to menu', glyph: 'promo', col: 1.7, row: 0.45, labelPos: 'above' },
    // restaurant / location-handoff popup (upper-mid)
    { id: 'restaurant', label: 'Choose Restaurant', glyph: 'popup', col: 3.35, row: 1.3, labelPos: 'left' },
    { id: 'productSel', label: 'Product, item selected', glyph: 'productSel', col: 5.15, row: 0.45, labelPos: 'above' },
    // location branch (upper-right): handoff state → Location Page
    { id: 'handoff', label: 'Handoff / location', glyph: 'handoff', col: 8.5, row: 0.5, labelPos: 'above' },
    { id: 'location', label: 'Location Page', glyph: 'location', col: 10.5, row: 0.5, labelPos: 'above' },
    // category branch (lower-mid)
    { id: 'category', label: 'NomNom Category', glyph: 'category', col: 4.0, row: 4.15 },
    { id: 'quantity', label: 'Choose Quantity', glyph: 'quantity', col: 6.15, row: 4.15 },
  ] as MvpNode[],
  /**
   * Every directed edge in the diagram with its pill label(s). `alt` marks the
   * conditional/alternate branches (drawn dashed, lower emphasis) so the happy
   * path stays legible. Routing `return` edges loop below the diagram.
   */
  edges: [
    // ── spine ──
    { from: 'home', to: 'menu', label: 'Scroll', kind: 'h' },
    { from: 'menu', to: 'product', label: 'Tap a product', label2: 'Location preselected', kind: 'h' },
    { from: 'product', to: 'bag', label: 'Add product', kind: 'h' },
    { from: 'bag', to: 'checkout', label: 'Check out', kind: 'h' },
    { from: 'checkout', to: 'confirmation', label: 'Check out', kind: 'h' },
    // ── promo branch (green) ──
    { from: 'home', to: 'promoNotif', label: 'Tap a promo', kind: 'elbow-up' },
    { from: 'promoNotif', to: 'productSel', label: 'Tap a product', label2: 'Location preselected', kind: 'h' },
    { from: 'productSel', to: 'bag', label: 'Add product', kind: 'elbow-down' },
    // ── location / handoff branch (orange) ──
    // no-location detours into the restaurant popup, which resolves location
    { from: 'product', to: 'restaurant', label: 'No location selected', kind: 'elbow-up', alt: true },
    { from: 'restaurant', to: 'productSel', label: 'Location selected', kind: 'elbow-up', alt: true },
    // change handoff/location from the bag → handoff state → location page → back
    { from: 'bag', to: 'handoff', label: 'Change location', kind: 'elbow-up', alt: true, off: -24, rail: 225 },
    { from: 'handoff', to: 'location', label: '', kind: 'elbow-up', alt: true, off: -24 },
    { from: 'location', to: 'handoff', label: 'Continue', kind: 'elbow-down', alt: true, off: 20, rail: 150 },
    { from: 'handoff', to: 'bag', label: '', kind: 'elbow-down', alt: true, off: 20, rail: 285 },
    // ── category branch (purple) ──
    { from: 'menu', to: 'category', label: 'Tap a category', label2: 'Location preselected', kind: 'elbow-down' },
    { from: 'category', to: 'quantity', label: 'Tap Product', kind: 'h', off: -12 },
    { from: 'quantity', to: 'category', label: 'Add Product', label2: 'Added to My Bag', kind: 'h-low', alt: true, off: 12 },
    { from: 'category', to: 'bag', label: 'Tap Bag Icon', kind: 'low-rail' },
    // ── loops ──
    { from: 'bag', to: 'menu', label: 'Add more', kind: 'return', alt: true },
    { from: 'confirmation', to: 'menu', label: 'Will send to scrolled location', kind: 'return', alt: true },
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
      blurb: 'From the homepage menu, open a category, set quantity in a popup; the item is added, then tap the bag to check out.',
      path: ['home', 'menu', 'category', 'quantity', 'category', 'bag', 'checkout', 'confirmation'],
    },
    {
      id: 'location',
      title: 'Choose a location',
      blurb: 'With no store set, the order detours through a location handoff before continuing to checkout.',
      path: ['home', 'menu', 'product', 'restaurant', 'productSel', 'bag', 'handoff', 'location', 'handoff', 'bag', 'checkout', 'confirmation'],
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

/* ─────────────────────────────────────────────────────────────────────────
 * MVP LAUNCH — closing bento for the MVP Fast-Launch section.
 * An asymmetric mixed-media grid that lands the section's two points: the
 * launch was FAST and SUCCESSFUL, and the experience shipped CROSS-PLATFORM
 * (one ordering flow across web + iOS + Android).
 *
 * Deliberately distinct from the Outcomes stat grid (section 5) — that section
 * owns the lifetime business numbers (4.8★, 16M members, $1B, #1 Ipsos). This
 * bento speaks only to the LAUNCH itself.
 *
 * Sourced facts (verified June 2026):
 *  - "We sped up that project by half a year" — Nidhin Mattappally, exec
 *     director, digital & restaurant experience, Panda Express
 *     (Food On Demand Q&A, Oct 15 2020). The native delivery platform was
 *     originally planned ~a year out; the pandemic pulled it ~6 months early.
 *  - "redesigned our ordering website and mobile apps to closely mirror our
 *     in-store experience" (same Q&A) → one experience across web + iOS +
 *     Android, mirroring in-store.
 *  - "Panda Delivers is available at more than 1,900 locations" (same Q&A) →
 *     a national rollout at launch, not a pilot.
 *  - Launched mid-June 2020 (The Spoon, 06/16/20: "This week … launched its
 *     own delivery service").
 * ───────────────────────────────────────────────────────────────────────── */

export interface MvpBentoStat {
  /** count-up target */
  value: number
  decimals?: number
  prefix?: string
  /** rendered after the number (e.g. '+', 'mo', '×') */
  suffix?: string
  /** tiny eyebrow above the number */
  eyebrow: string
  /** one-line caption below the number */
  caption: string
}

export const mvpLaunch = {
  /** eyebrow shown above the bento (matches the section's quiet labels) */
  kicker: 'THE LAUNCH',
  heading: 'Fast launch, shipped everywhere',
  /** the dark flagship cell — the headline launch story */
  flagship: {
    eyebrow: 'FLAGSHIP LAUNCH',
    title: 'Panda Delivers',
    body: 'A full ordering platform across web, iOS, and Android, redesigned to mirror the in-store experience and shipped in the middle of the 2020 pivot.',
    /** pulled-forward proof, stated plainly under the title */
    proof: 'Originally planned a year out, then pulled six months early to meet the moment.',
  },
  /** cross-platform cell — carries the device FPO slots */
  platform: {
    eyebrow: 'ONE EXPERIENCE',
    title: 'Web, iOS & Android',
    body: 'The same ordering flow across every surface, designed once and shipped everywhere.',
    /** two real MVP phone screens (portrait). Drop-in replaceable. */
    phones: ['/panda/mvp/screen1.webp', '/panda/mvp/screen2.webp'],
    /** web/desktop capture for the browser frame — FPO placeholder until set. */
    webSrc: '' as string,
  },
  /** two compact count-up stat cells (LAUNCH facts only) */
  stats: [
    {
      value: 6,
      suffix: ' mo',
      eyebrow: 'AHEAD OF PLAN',
      caption: 'Pulled forward from a one-year roadmap to meet the pandemic pivot.',
    },
    {
      value: 1900,
      suffix: '+',
      eyebrow: 'LOCATIONS AT LAUNCH',
      caption: 'A national rollout from day one, not a single-market pilot.',
    },
  ] as MvpBentoStat[],
  /** operating-model cell — the disciplined MVP framing */
  model: {
    eyebrow: 'OPERATING MODEL',
    title: 'Web-first MVP, features as fast-follows',
    body: 'Core ordering first, with the web prioritized. Curbside, rewards, and the native app experience landed as deliberate fast-follows.',
  },
  /** quiet sourced footnote */
  source:
    'Launch detail per Panda Express digital leadership (Food On Demand, Oct 2020) and contemporaneous reporting (The Spoon, June 2020).',
}
