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
      icon: 'workflow',
      title: 'One order, three systems',
      body: 'Menus, pricing, item availability, and order status originated in the backend, were acted on in the restaurant, and were promised to the guest. Every screen had to be designed around what each system actually knew — and when it knew it.',
    },
    {
      tag: '02',
      icon: 'data',
      title: '2,300+ restaurants, each their own source of truth',
      body: 'Store hours, regional menus, sold-out items, kitchen throughput at peak. The UI had to absorb per-location variance without ever making the guest do the reconciling.',
    },
    {
      tag: '03',
      icon: 'target',
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
 * PREMIUM REWARDS APP — standalone hero that opens the rewards chapter
 * (Figma node 292:25968, "MVP Section 6"). A full-bleed Panda-red band: the
 * title + two-phase summary sit top-left, the scaled-up two-phone rewards
 * mockup bursts from a radial firework at the centre, and gold sparkles /
 * fireworks animate on and off across the top.
 * ───────────────────────────────────────────────────────────────────────── */
export const premiumRewards = {
  heading: 'PREMIUM REWARDS APP',
  intro:
    'The premium rewards app came in two phases. Phase one: improve the fast-launch experience. Phase two: plan, design, test and execute a rewards system across all locations.',
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
  /** manual label position (viewBox units) for edges where the auto-anchor
   *  would land awkwardly (e.g. a label on a vertical segment). */
  labelAt?: { x: number; y: number }
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
  { id: 'menu', label: 'Menu', glyph: 'menu', col: 2.1, row: 2.6 },
  { id: 'product', label: 'Product Page', glyph: 'product', col: 5.55, row: 2.6 },
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
    { id: 'promoNotif', label: 'Item added to menu', glyph: 'promo', col: 1.55, row: 0.45, labelPos: 'above' },
    // restaurant / location-handoff popup (upper-mid)
    { id: 'restaurant', label: 'Choose Restaurant', glyph: 'popup', col: 2.95, row: 1.3, labelPos: 'left' },
    { id: 'productSel', label: 'Product, item selected', glyph: 'productSel', col: 5.55, row: 0.45, labelPos: 'above' },
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
    { from: 'home', to: 'promoNotif', label: 'Tap a promo', kind: 'elbow-up', rail: 210, labelAt: { x: 108, y: 278 } },
    { from: 'promoNotif', to: 'productSel', label: 'Tap a product', label2: 'Location preselected', kind: 'h' },
    { from: 'productSel', to: 'bag', label: 'Add product', kind: 'elbow-down' },
    // ── location / handoff branch (orange) ──
    // no-location detours into the restaurant popup, which resolves location
    { from: 'product', to: 'restaurant', label: 'No location selected', kind: 'elbow-up', alt: true },
    { from: 'restaurant', to: 'productSel', label: 'Location selected', kind: 'elbow-up', alt: true },
    // change handoff/location from the bag → handoff state → location page → back
    { from: 'bag', to: 'handoff', label: 'Change location', kind: 'elbow-up', alt: true, off: -24, rail: 225 },
    { from: 'handoff', to: 'location', label: '', kind: 'h', alt: true, off: -14 },
    { from: 'location', to: 'handoff', label: 'Continue', kind: 'h', alt: true, off: 14 },
    { from: 'handoff', to: 'bag', label: '', kind: 'elbow-down', alt: true, off: 20, rail: 285 },
    // ── category branch (purple) ──
    { from: 'menu', to: 'category', label: 'Tap a category', label2: 'Location preselected', kind: 'elbow-down', rail: 430 },
    { from: 'category', to: 'quantity', label: 'Tap Product', kind: 'h', off: -18 },
    { from: 'quantity', to: 'category', label: 'Add Product', label2: 'Added to My Bag', kind: 'h-low', alt: true, off: 18 },
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
  /** inline SVG markup for the eyebrow icon (path uses currentColor via CSS) */
  icon?: string
}

/* Stat-cell eyebrow icons (Joshua's exports). Rendered at 18px; the wrapper
 * sets `fill: currentColor` so the black paths pick up Panda red. */
const ICON_CALENDAR =
  '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M22 2C22.5128 2 22.9354 2.38645 22.9932 2.88379L23 3V4H25.667C27.5077 4.00018 28.9998 5.49232 29 7.33301V26.667C28.9998 28.5077 27.5077 29.9998 25.667 30H6.33301C4.49232 29.9998 3.00018 28.5077 3 26.667V7.33301C3.00018 5.49232 4.49232 4.00018 6.33301 4H9V3C9 2.44772 9.44772 2 10 2C10.5128 2 10.9354 2.38645 10.9932 2.88379L11 3V4H21V3C21 2.44772 21.4477 2 22 2ZM5 13V26.667C5.00018 27.4031 5.59689 27.9998 6.33301 28H25.667C26.4031 27.9998 26.9998 27.4031 27 26.667V13H5ZM6.33301 6C5.59689 6.00018 5.00018 6.59689 5 7.33301V11H27V7.33301C26.9998 6.59689 26.4031 6.00018 25.667 6H23V8C23 8.55228 22.5523 9 22 9C21.4872 9 21.0646 8.61355 21.0068 8.11621L21 8V6H11V8C11 8.55228 10.5523 9 10 9C9.48716 9 9.0646 8.61355 9.00684 8.11621L9 8V6H6.33301Z"/></svg>'
const ICON_PANDA_PIN =
  '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 2C22.0751 2 27 6.92487 27 13C27 21.5406 16.0383 28.8631 16 28.8887L15.9023 28.8223C14.8122 28.0705 5 21.0802 5 13C5 6.92487 9.92487 2 16 2ZM15.8154 5.06152C11.499 5.06167 8 8.56062 8 12.877C8.00003 17.1933 11.499 20.6922 15.8154 20.6924C20.1317 20.6924 23.6308 17.1933 23.6309 12.877C23.6309 8.56053 20.1317 5.06152 15.8154 5.06152ZM17.9365 7.02637C18.8658 6.91847 19.9922 7.85698 19.4814 9.06641C19.3999 9.25971 19.2765 9.45926 19.1035 9.66016C19.4975 10.1107 19.8187 10.5884 20.0537 11.1738C20.3562 11.9286 20.5136 12.7891 20.5527 13.6133L20.5625 13.9639C20.5625 13.9724 20.567 14.1393 20.8945 14.1445C21.0422 14.1413 21.1714 14.0647 21.2207 14.0312C21.4554 13.867 21.6724 13.5451 21.7158 13.0254L21.7236 12.8438L21.7227 12.7529C21.7013 11.8861 21.3692 11.189 21.1826 10.8643L21.0693 10.6816L21.1523 10.8008C21.4151 11.1906 21.6557 11.638 21.8291 12.1387C21.8988 12.3399 21.9574 12.5503 22.0029 12.7686L22.0537 13.0605L22.0635 13.1328C22.0804 13.2636 22.0922 13.3971 22.0996 13.5332L22.1055 13.6553L22.1074 13.7803L22.1045 14.0361C22.0041 17.4194 19.9124 17.2833 19.8838 17.2812C18.8217 19.2878 17.3779 19.6054 16.6963 19.6543C16.514 19.6676 16.2811 19.6551 16.1445 19.627C15.697 19.5358 15.5105 19.2553 15.4316 19.04L15.3975 18.9258L15.3838 18.8623L15.374 18.7637C15.3645 18.3981 15.6115 18.0788 15.8301 17.6797C16.023 17.3268 16.0793 17.1213 16.0391 16.7646C15.9887 16.3239 15.6366 16.1105 15.335 16.0811C14.7207 16.0211 14.3571 16.5542 14.4072 17.1494C14.441 17.5598 14.788 17.9613 14.7881 18.3789C14.7881 18.9607 14.2889 19.281 13.7471 19.2041C13.1449 19.1199 12.6278 18.8748 12.1836 18.4746C11.5006 17.8585 11.1432 17.015 10.9648 16.0996C10.8166 15.3458 10.9304 14.4917 11.166 13.7744C11.2775 13.431 11.3663 13.2176 11.5254 12.9648L11.582 13.0771L11.7695 13.4014L11.9053 13.5918L12.0205 13.7344L12.1338 13.8564C12.4592 14.2054 12.8783 14.421 13.3105 14.8311L13.458 14.9717C13.535 15.0352 13.5828 15.0747 13.6533 15.1182L13.7578 15.1768L13.8613 15.2275C13.8921 15.2409 13.9239 15.2538 13.9561 15.2656C14.1152 15.3264 14.2918 15.3692 14.4795 15.3896L14.6924 15.4033H14.7471L14.9648 15.3916C15.3925 15.3469 15.7752 15.1764 16.1465 14.9795L16.7051 14.6758L17.5068 14.2666L17.6904 14.1553C19.168 13.2585 19.1499 11.644 19.1396 11.416L19.1387 11.3887C19.1092 9.80922 18.1502 8.45622 16.7861 7.85547C17.0757 7.43204 17.525 7.07447 17.9365 7.02637ZM15.7656 11.1719C16.2129 10.9936 16.8126 11.3164 16.9609 12.1631C17.0948 12.9242 16.5636 13.4212 16.293 13.4824L16.2432 13.4883C16.1478 13.4859 16.0772 13.4462 16.0293 13.4072L15.9951 13.376L15.958 13.333C15.9293 13.2936 15.9069 13.2482 15.8887 13.1973L15.8643 13.1162C15.8137 12.9139 15.7175 12.7264 15.5137 12.3662C15.1707 11.7599 15.4521 11.2961 15.7656 11.1719ZM12.4121 11.9443C12.6083 11.1447 13.2003 10.8737 13.6172 11.0723C13.9086 11.2114 14.1485 11.6725 13.7822 12.2305L13.6221 12.4805C13.5315 12.6261 13.4712 12.7361 13.4287 12.8438L13.3994 12.9248C13.384 12.9726 13.3662 13.016 13.3447 13.0547L13.3018 13.1201C13.2767 13.1545 13.1884 13.2578 13.0273 13.2578C12.7992 13.259 12.2205 12.7262 12.4121 11.9443ZM11.666 9.64062C10.1158 8.09844 11.5687 6.79892 12.6504 6.96094C13.1265 7.03246 13.4494 7.36446 13.6309 7.7002L13.6865 7.8125L13.6738 7.81738C13.2181 8.00376 12.8069 8.27261 12.4561 8.60352L12.2842 8.77441C12.1091 8.96107 11.9531 9.16385 11.8174 9.37988L11.667 9.63965L11.666 9.64062Z"/></svg>'

export const mvpLaunch = {
  /** eyebrow shown above the bento (matches the section's quiet labels) */
  kicker: 'THE LAUNCH',
  heading: 'Fast launch, shipped everywhere',
  /** the dark flagship cell — the seamless cross-platform release story */
  flagship: {
    eyebrow: 'THE PLATFORM',
    title: 'Panda Delivers',
    body: 'One ordering experience, designed in lockstep across the phone app and the web — the same flow, the same checkout, wherever a guest started.',
    /** the cross-platform device composition (phone app + web checkout) */
    image: '/panda/appstore/release-devices.webp',
    /** seamless-release proof, stated plainly under the body */
    proof: 'App and web shipped together, mirroring the in-store order to the dish.',
  },
  /** App Store release cell — the iOS listing screenshots as a gallery strip */
  platform: {
    eyebrow: 'THE RELEASE',
    title: 'On the App Store',
    body: 'A native iOS app, shipped to the store — menu, pickup and delivery, locations, and catering, all in the guest’s pocket.',
    /** real App Store listing screenshots (6.5" portrait). */
    screens: [
      '/panda/appstore/appstore-1.webp',
      '/panda/appstore/appstore-2.webp',
      '/panda/appstore/appstore-3.webp',
      '/panda/appstore/appstore-4.webp',
      '/panda/appstore/appstore-5.webp',
    ],
    /** alt text per screenshot (order matches `screens`) */
    alts: [
      'App Store screenshot — “We wok for you,” build-your-meal menu',
      'App Store screenshot — order summary and recent orders',
      'App Store screenshot — “Pickup or delivery,” locations map',
      'App Store screenshot — menu categories',
      'App Store screenshot — “Even for a large party,” catering',
    ],
  },
  /** two compact count-up stat cells (LAUNCH facts only) */
  stats: [
    {
      value: 6,
      suffix: ' mo',
      eyebrow: 'AHEAD OF PLAN',
      caption: 'Pulled forward from a one-year roadmap to meet the pandemic pivot.',
      icon: ICON_CALENDAR,
    },
    {
      value: 1900,
      suffix: '+',
      eyebrow: 'LOCATIONS AT LAUNCH',
      caption: 'A national rollout that followed a successful multi-city pilot.',
      icon: ICON_PANDA_PIN,
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
