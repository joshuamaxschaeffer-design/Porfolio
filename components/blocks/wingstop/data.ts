/**
 * Wingstop case study — content defaults.
 * Same pattern as the Panda Express build: all copy lives here; the Payload
 * block only carries optional overrides.
 *
 * Joshua's role across EVERY workstream below: he personally did the UX/UI, then
 * handed off to designers (junior→senior) under him, coaching/mentoring and art-
 * directing their execution — a lead + art director + player-coach story.
 *
 * Real imagery lives under /public/wingstop/* (optimized from his source files).
 * Outcomes stats sourced from public reporting (verified June 2026):
 *  - Apple App Store listing (4.9★, 1.4M ratings)
 *  - Wingstop Inc. SEC filings / Forms 8-K (digital mix 30.2% Q1'19 → 63.7%
 *    Q2'20 → 70.3% Q4'24; FY2024 systemwide $4.8B; 2,563 locations)
 *  - Google Play listing (5M+ installs)
 *  - Wingstop newsroom (Hathway + Olo redesign: Flavor World, Wing Calculator™)
 */

export const overview = {
  client: 'Wingstop',
  dateRange: '2019 — 2022',
  lead: 'Wingstop’s menu had outgrown its ordering experience — eleven flavors, endless bundle math, and a different menu at every store. I led the redesign of the app around the thing people actually crave: flavor. It shipped a year before COVID, then carried the business the day dining rooms closed.',
  role: 'Lead Designer & Art Director (Hathway, now Bounteous). I owned the flavor-first ordering experience end to end — UX strategy, working prototypes, and the art direction of the photography-forward menu — then led and mentored a team of designers (junior through senior) who built it out across platforms, campaigns, and in-store screens.',
  scope: [
    'Mobile + Web App UI/UX',
    'Art Direction',
    'UX Strategy',
    'Prototyping',
    'Design Leadership',
  ],
  /** Cinematic hero shot (front-facing flavor blast) that bleeds in on the right. */
  heroImage: '/wingstop/hero/mango-hawaiian.webp',
  /** Floating food cut-outs sprinkled around the black hero. */
  floaters: [
    { src: '/wingstop/food/float-fry.webp', alt: '' },
    { src: '/wingstop/food/float-wing.webp', alt: '' },
    { src: '/wingstop/food/float-fry-group.webp', alt: '' },
  ],
}

/** SECTION 2 — The full app, across platforms (foundational, built first). */
export const appFoundation = {
  eyebrow: 'THE FOUNDATION',
  heading: 'THE FULL APP, ACROSS PLATFORMS',
  intro: 'Before the flavor work, the foundation: I pitched and designed the entire ordering app — product pages, customization, cart, and checkout — across mobile and desktop, then led the team that built it out screen by screen.',
  /** Tall product/cart/checkout screens for the perspective stage. */
  screens: [
    { src: '/wingstop/product/m-product-1.webp', alt: 'Wing combo product page' },
    { src: '/wingstop/product/m-product-2.webp', alt: 'Upgraded sides' },
    { src: '/wingstop/product/m-product-3.webp', alt: 'Special requests' },
    { src: '/wingstop/product/m-product-4.webp', alt: 'Product detail' },
    { src: '/wingstop/product/m-cart.webp', alt: 'Cart' },
    { src: '/wingstop/product/m-checkout.webp', alt: 'Checkout' },
  ],
  caption: 'Product, customization, cart and checkout — designed mobile-first, then scaled to desktop.',
}

export const challenge = {
  heading: 'THE CHALLENGE',
  intro: 'Ordering wings is a group decision with too many variables — flavors, counts, combos, crew size, and a menu that changes store to store. The old experience made guests do all of that work. The redesign had to make a complicated order feel like a crave.',
  problems: [
    {
      tag: '01',
      icon: 'menu',
      title: 'A menu that outgrew its UI',
      body: 'Eleven flavors across heat levels, plus bundles, tenders, sides, and dips. Choice overload buried the thing Wingstop sells best — flavor — under taxonomy.',
    },
    {
      tag: '02',
      icon: 'store',
      title: 'Every store, its own menu',
      body: 'Locations run their own promotions and availability, so the menu genuinely varies store to store. The UI had to absorb that variance without ever making the guest reconcile it.',
    },
    {
      tag: '03',
      icon: 'math',
      title: 'Group orders are math',
      body: 'How many wings feed a crew of five, two of them starving? Translating appetite and headcount into the right bundle was friction guests felt on every order.',
    },
  ],
  /** Old → New before/after (the redesign, in one drag). */
  compare: {
    eyebrow: 'OLD → NEW',
    title: 'From a wall of menu to a wall of flavor',
    body: 'The 2019 experience asked guests to parse a group-packs spreadsheet. The redesign leads with photography and flavor, and hides the variance.',
    before: '/wingstop/ux/old-desktop.webp',
    after: '/wingstop/ux/new-desktop.webp',
    beforeLabel: '2019 — the old menu',
    afterLabel: 'Flavor-first redesign',
  },
}

/** SECTION 4 — Flavor World (the dark, photography-forward showpiece). */
export const flavorWorld = {
  eyebrow: 'FLAVOR WORLD',
  heading: 'ORDERING BY CRAVE, NOT BY CATEGORY',
  intro: 'We rebuilt the menu around flavor. A heat scale runs from sweet Hawaiian to sweat-inducing Atomic, photography-forward pages make every flavor the hero, and browsing the menu becomes the appetizer.',
  /** Tall real flavor screens for the perspective device grid. */
  screens: [
    { src: '/wingstop/flavor/m-all-flavors.webp', alt: 'All flavors page' },
    { src: '/wingstop/flavor/m-lemon-pepper.webp', alt: 'Lemon Pepper flavor page' },
    { src: '/wingstop/flavor/d-lemon-pepper.webp', alt: 'Lemon Pepper, desktop' },
    { src: '/wingstop/flavor/d-garlic-parm.webp', alt: 'Garlic Parmesan, desktop' },
    { src: '/wingstop/flavor/d-louisiana-rub.webp', alt: 'Louisiana Rub, desktop' },
  ],
  /** Heat-scale slider — real shipped UI (No Heat → Blazing Hot). */
  heat: {
    eyebrow: 'THE HEAT SCALE',
    title: 'Pick by heat, not by hunting',
    body: 'A single slider sets the tone — from no-heat sweet to blazing-hot Atomic — and filters the whole menu to match the mood. Drag it.',
  },
  /** Flavor icons (Joshua designed an icon system for these). */
  iconsEyebrow: 'A FLAVOR ICON SYSTEM',
  iconsNote: 'I designed an icon for every flavor so the menu could speak in glyphs, not paragraphs.',
  icons: [
    { src: '/wingstop/flavor-icons/hawaiian.svg', name: 'Hawaiian' },
    { src: '/wingstop/flavor-icons/lemon-pepper.svg', name: 'Lemon Pepper' },
    { src: '/wingstop/flavor-icons/garlic-parm.svg', name: 'Garlic Parm' },
    { src: '/wingstop/flavor-icons/mild.svg', name: 'Mild' },
    { src: '/wingstop/flavor-icons/original-hot.svg', name: 'Original Hot' },
    { src: '/wingstop/flavor-icons/louisiana-rub.svg', name: 'Louisiana Rub' },
    { src: '/wingstop/flavor-icons/cajun.svg', name: 'Cajun' },
    { src: '/wingstop/flavor-icons/spicy-korean.svg', name: 'Spicy Korean Q' },
    { src: '/wingstop/flavor-icons/mango-habanero.svg', name: 'Mango Habanero' },
    { src: '/wingstop/flavor-icons/bbq.svg', name: 'Hickory BBQ' },
    { src: '/wingstop/flavor-icons/old-bay.svg', name: 'Old Bay' },
    { src: '/wingstop/flavor-icons/atomic.svg', name: 'Atomic' },
  ],
  /** Flavor names for the marquee strip. */
  marquee: [
    'HAWAIIAN', 'LEMON PEPPER', 'GARLIC PARMESAN', 'MILD', 'ORIGINAL HOT',
    'LOUISIANA RUB', 'CAJUN', 'SPICY KOREAN Q', 'MANGO HABANERO', 'HICKORY BBQ',
    'ATOMIC',
  ],
}

/** SECTION 5 — Improved Usability (a large UX project). */
export const usability = {
  eyebrow: 'IMPROVED USABILITY',
  heading: 'A COMPLICATED ORDER, MADE SIMPLE',
  intro: 'The biggest UX project: rebuilding the build-your-meal flow. A 15-piece meal for two used to mean a dozen decisions. We turned it into a guided sequence — pick flavors, set quantities, choose sides and drinks, upgrade — that feels like a crave, not a form.',
  /** The Wing Calculator™ hunger scale (reskinned FeelingSlider). */
  calculator: {
    eyebrow: 'WING CALCULATOR™',
    title: 'Math nobody should do hungry',
    body: 'Rate your hunger — snacky, hungry, or starving — and the Wing Calculator™ sizes the order to your crew. Group-order friction, engineered away. Try the scale.',
  },
  /** Step screens for the horizontal walkthrough. */
  steps: [
    { src: '/wingstop/usability/step-1-flavors.webp', title: 'Choose flavors', body: 'Browse by flavor and heat, not a dropdown.' },
    { src: '/wingstop/usability/step-1b-quantities.webp', title: 'Specify quantities', body: 'Split the count across flavors with a slider per flavor.' },
    { src: '/wingstop/usability/step-2-side.webp', title: 'Choose a side', body: 'Fries, corn, veggies — shown, not listed.' },
    { src: '/wingstop/usability/step-3-drink.webp', title: 'Choose a drink', body: 'Brand logos make the pick instant.' },
    { src: '/wingstop/usability/step-4-upgrade.webp', title: 'Upgrade a side', body: 'One tap to make it a meal.' },
    { src: '/wingstop/usability/step-5-review.webp', title: 'Review & order', body: 'Every step visible, nothing buried.' },
  ],
}

/** SECTION 6 — Range of craft: Dark Mode + In-Store + CRM. */
export const craft = {
  eyebrow: 'RANGE OF CRAFT',
  heading: 'ONE SYSTEM, MANY SURFACES',
  intro: 'The flavor-first system reached further than the order screen — a sleek dark mode, physical menu boards in restaurants, and a modular email engine that powered campaign after campaign.',
  darkMode: {
    eyebrow: 'DARK MODE',
    title: 'The whole app, after dark',
    body: 'A full dark theme — personalized home, reorder, menu, configurator, and checkout — designed so the food photography only got richer.',
    screens: [
      { src: '/wingstop/darkmode/dm-1.webp', alt: 'Dark mode home' },
      { src: '/wingstop/darkmode/dm-2.webp', alt: 'Dark mode menu' },
      { src: '/wingstop/darkmode/dm-3.webp', alt: 'Dark mode configurator' },
      { src: '/wingstop/darkmode/dm-4.webp', alt: 'Dark mode location' },
      { src: '/wingstop/darkmode/dm-checkout.webp', alt: 'Dark mode checkout' },
    ],
  },
  inStore: {
    eyebrow: 'IN-STORE DISPLAYS',
    title: 'Designed for the wall, too',
    body: 'Vertical and horizontal digital menu boards — combos, group packs, extras, drinks — implemented in restaurants.',
    boards: [
      { src: '/wingstop/instore/board-1.webp', alt: 'In-store menu board 1' },
      { src: '/wingstop/instore/board-2.webp', alt: 'In-store menu board 2' },
    ],
  },
  crm: {
    eyebrow: 'MODULAR CRM',
    title: 'One email system, every campaign',
    body: 'A modular email design — 25 Days of Flavor, game-day promos, delivery, onboarding — assembled from shared blocks so the team could ship campaigns fast and on-brand.',
    emails: [
      { src: '/wingstop/crm/crm-25days.webp', alt: '25 Days of Flavor' },
      { src: '/wingstop/crm/crm-60wings.webp', alt: '60 wings promo' },
      { src: '/wingstop/crm/crm-5off.webp', alt: '$5 off' },
      { src: '/wingstop/crm/crm-bignight.webp', alt: 'Big Night In' },
      { src: '/wingstop/crm/crm-biggame.webp', alt: 'Game-day kickoff' },
      { src: '/wingstop/crm/crm-freedelivery.webp', alt: 'Free delivery' },
      { src: '/wingstop/crm/crm-welcome.webp', alt: 'Welcome / onboarding' },
    ],
  },
}

/** SECTION 7 — More work (lower-priority, carousel). */
export const moreWork = {
  eyebrow: 'MORE WORK',
  heading: 'AND EVERYTHING AROUND IT',
  intro: 'Beyond the core experience, the team and I shipped the supporting surfaces too — store-finder pages that helped guests find a location, and more.',
  items: [
    { src: '/wingstop/location/loc-1.webp', title: 'Locations', body: 'Store-finder redesign' },
    { src: '/wingstop/location/loc-2.webp', title: 'Location page', body: 'Per-store detail' },
    { src: '/wingstop/location/loc-finder.webp', title: 'Find a store', body: 'Map + list finder' },
  ],
}

/** SECTION 8 — The COVID payoff. */
export const covid = {
  eyebrow: 'THE PAYOFF',
  heading: 'THEN THE WORLD SHUT DOWN',
  intro: 'The app shipped in 2019. A year later, COVID closed every dining room — and the year-old ordering experience became the entire business overnight.',
  beats: [
    {
      eyebrow: 'SHIPPED 2019',
      title: 'A year early, by luck',
      body: 'The flavor-first app launched a full year before anyone knew dining rooms would close. Digital was already the strategy.',
    },
    {
      eyebrow: 'MARCH 2020',
      title: 'Dining rooms close',
      body: 'Overnight, every order had to go through digital. The app wasn’t a convenience anymore — it was the storefront.',
    },
    {
      eyebrow: 'THE RESULT',
      title: 'The app became the business',
      body: 'Digital jumped to 63.7% of sales in a single quarter, same-store sales rose 31.9%, and WING stock ran to record highs.',
    },
  ],
}

/** Closing CTA. */
export const cta = {
  eyebrow: 'LIVE ON THE APP STORE',
  headline: 'Order wings the way people actually crave them.',
  ctaLabel: 'Get the app',
  ctaHref: 'https://apps.apple.com/us/app/wingstop/id556467500',
  links: [
    { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.wingstop' },
    { label: 'wingstop.com', href: 'https://www.wingstop.com' },
  ],
}

export interface WingstopStat {
  /** numeric target the count-up animates to */
  value: number
  /** decimal places to render during/after the count-up (default 0) */
  decimals?: number
  prefix?: string
  /** rendered in Wingstop green after the number, e.g. "%" / "★" */
  suffix?: string
  label: string
  description: string
}

export const outcomes = {
  heading: 'OUTCOMES',
  lead: 'Shipped a year before anyone knew the whole business would have to run through it, the app anchored Wingstop’s transformation into one of the most digital restaurant brands in America.',
  stats: [
    {
      value: 4.9,
      decimals: 1,
      suffix: '★',
      label: 'App Store Rating',
      description: 'Across 1.4 million+ ratings on iOS — among the highest-rated ordering apps in the category.',
    },
    {
      value: 63.7,
      decimals: 1,
      suffix: '%',
      label: 'COVID Digital Surge',
      description: 'Digital share of sales in Q2 2020 — double the 30% mix from when the app launched a year earlier.',
    },
    {
      value: 70.3,
      decimals: 1,
      suffix: '%',
      label: 'Digital Sales Mix',
      description: 'Share of systemwide sales flowing through digital by Q4 2024 — still climbing, at 72.8% by late 2025.',
    },
    {
      value: 4.8,
      decimals: 1,
      prefix: '$',
      suffix: 'B',
      label: 'Systemwide Sales',
      description: 'FY2024 systemwide sales, up 36.8% year over year, with digital the dominant channel.',
    },
    {
      value: 2563,
      label: 'Restaurants Served',
      description: 'Worldwide locations whose orders flow through the digital experience (FY2024).',
    },
    {
      value: 5,
      suffix: 'M+',
      label: 'Android Installs',
      description: 'Google Play downloads alongside the 1.4M-rating iOS install base.',
    },
  ] as WingstopStat[],
  sources:
    'Sources: Apple App Store (2026) · Wingstop Inc. SEC filings, Forms 8-K 2019–2025 · Google Play (2026) · Wingstop newsroom',
}
