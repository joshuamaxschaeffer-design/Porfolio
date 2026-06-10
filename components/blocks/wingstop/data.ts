/**
 * Wingstop case study — content defaults.
 * Same pattern as the Panda Express build: all copy lives here; the Payload
 * block only carries optional overrides. Outcomes stats sourced from public
 * reporting (verified June 2026):
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
  role: 'Lead Designer & Art Director (Hathway, now Bounteous) — led the flavor-first ordering experience end to end, from UX strategy and working prototypes through art direction of the photography-forward menu.',
  scope: [
    'Mobile App UI/UX',
    'Art Direction',
    'UX Strategy',
    'Prototyping',
    'Ordering Experience',
  ],
}

export const challenge = {
  heading: 'THE CHALLENGE',
  intro: 'Ordering wings is a group decision with too many variables — flavors, counts, combos, crew size, and a menu that changes store to store. The old experience made guests do all of that work. The redesign had to make a complicated order feel like a crave.',
  problems: [
    {
      tag: '01',
      title: 'A menu that outgrew its UI',
      body: 'Eleven flavors across heat levels, plus bundles, tenders, sides, and dips. Choice overload buried the thing Wingstop sells best — flavor — under taxonomy.',
    },
    {
      tag: '02',
      title: 'Every store, its own menu',
      body: 'Locations run their own promotions and availability, so the menu genuinely varies store to store. The UI had to absorb that variance without ever making the guest reconcile it.',
    },
    {
      tag: '03',
      title: 'Group orders are math',
      body: 'How many wings feed a crew of five, two of them starving? Translating appetite and headcount into the right bundle was friction guests felt on every order.',
    },
  ],
}

export const redesign = {
  heading: 'THE FLAVOR-FIRST REDESIGN',
  intro: 'We rebuilt the experience around flavor and appetite instead of menu structure — then watched it carry the entire business when the world shut down.',
  features: [
    {
      tag: 'FLAVOR WORLD',
      title: 'Ordering by crave, not by category',
      body: 'A sliding flavor scale runs the menu from sweet Hawaiian to sweat-inducing Atomic, with photography-forward imagery guiding guests through Flavor World. Browsing the menu became the appetizer.',
      placeholder: 'Flavor World app screens — in progress',
    },
    {
      tag: 'WING CALCULATOR™',
      title: 'Math nobody should do hungry',
      body: 'Rate your hunger — snacky, hungry, or starving — tell it the size of your crew, and the Wing Calculator™ builds the right order. Group-order friction, engineered away.',
      placeholder: 'Wing Calculator screens — in progress',
    },
  ],
  covidStrip:
    'Then COVID closed every dining room. The year-old app became the business overnight — digital jumped to 63.7% of sales in a single quarter, same-store sales rose 31.9%, and WING stock ran to record highs.',
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
