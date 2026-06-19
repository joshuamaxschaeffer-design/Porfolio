/**
 * Samsung case study — content defaults.
 * Same pattern as the Panda/Wingstop builds: all copy lives here; the Payload
 * block only carries optional overrides.
 *
 * Tone (per Joshua, 2026-06-19): this was his FIRST design job — frame it as a
 * learning experience, do NOT exaggerate outcomes. The role: web/product pages,
 * helping build an in-store experience UI, and hundreds of social mockups
 * (photo editing + device compositing). Outcomes lead with his own output;
 * Samsung's corporate scale appears only as labelled context, not as credit.
 * The one external figure is IDC (Samsung #1 smartphone maker, 2013–2017).
 */

export const overview = {
  client: 'Samsung',
  dateRange: '2013 — 2017',
  lead: 'My first design job, at Razorfish on the Samsung Mobile account. Product pages, an in-store experience, and hundreds of social posts.',
  role: 'Junior / mid designer at Razorfish on the Samsung Mobile account. Web design for product and launch pages, UI for an interactive in-store experience, and hundreds of social media mockups across photo editing and device compositing.',
  scope: [
    'Web & Product Pages',
    'Social Media Mockups',
    'Photo Editing & Compositing',
    'In-Store Experience UI',
    'Device Mockups',
  ],
}

export const brief = {
  heading: 'THE BRIEF',
  intro: 'A junior seat on the account meant learning the craft inside real constraints: brand guidelines to hit exactly, a launch calendar that never stopped, and a social feed that was hungry every single day.',
  problems: [
    {
      tag: '01',
      title: 'A brand bible to hit',
      body: 'Samsung Mobile work meant matching a strict global brand system across type, color, and product photography on every page and post. A great place to learn precision early.',
    },
    {
      tag: '02',
      title: 'A feed that never sleeps',
      body: 'Social was constant. Hundreds of mockups over the years, from photo edits to device composites, kept Galaxy phones, tablets, and Gear in the feed across launches and promotions.',
    },
    {
      tag: '03',
      title: 'A calendar that never stops',
      body: 'Galaxy S in the spring, Note in the fall, Gear and Tab in between. New product work overlapped the last campaign’s wrap-up, for several years running.',
    },
  ],
}

export const work = {
  heading: 'THE WORK',
  intro: 'Three kinds of work across the account: the product and landing pages, the in-store experience, and the social feed behind hundreds of mockups.',
  closer:
    'The job where the fundamentals clicked: brand discipline, production speed, and how web, retail, and social all have to tell the same story.',
}

/**
 * Work imagery — the real assets (Joshua's, 2013–17), optimized to WebP in
 * /public/samsung/work. Grouped by workstream so the Work section can lay each
 * out at its true aspect ratio (no forcing widescreen captures into phone
 * frames). Dimensions are the post-optimization pixel sizes.
 */
export const webPages = {
  tag: 'WEB & PRODUCT PAGES',
  title: 'Product and landing pages',
  body: 'Long-scroll product pages for Galaxy phones and tablets. High-fidelity layouts built around a handful of supplied product shots, on a brand system to match exactly.',
  shots: [
    { file: 'landing-1.webp', w: 1100, h: 2954, alt: 'Samsung Gear Fit product page — “Fit for Your Active Lifestyle”' },
    { file: 'landing-3.webp', w: 1100, h: 2897, alt: 'Samsung Galaxy Tab S product page — “Slim Design, Stunning Performance”' },
    { file: 'landing-2.webp', w: 1100, h: 2731, alt: 'Samsung Galaxy Note 3 product page — “Big Screen, Big Difference”' },
  ],
}

export const inStore = {
  tag: 'IN-STORE EXPERIENCE',
  title: 'A table that demoed the ecosystem',
  body: 'UI for an interactive, table-mounted retail experience: VR 360° video, a Gear Fit step-count game, and an S7 store locator, combining video with hands-on takeovers.',
  // The physical table render (transparent bg) leads, then the flat screens.
  device: { file: 'table-device.webp', w: 1800, h: 1666, alt: 'Interactive in-store table with the Galaxy S7 + Gear VR experience on screen' },
  screens: [
    { file: 'table-1.webp', w: 1600, h: 900, alt: 'In-store table screen — choose a Galaxy S7 “splash” reveal' },
    { file: 'table-3.webp', w: 1600, h: 900, alt: 'In-store table screen — tap to raise your Gear Fit step count' },
    { file: 'table-2.webp', w: 1600, h: 900, alt: 'In-store table screen — “Off Day” meal calculator with Gear Fit' },
  ],
  locator: { file: 'store-locator-module.webp', w: 1400, h: 722, alt: 'S7 store-locator module — find a store near you' },
}

/**
 * Social mockups — a curated 10 of the hundreds produced for the account.
 * Files live in /public/samsung/social (optimized WebP). The squares are the
 * native Facebook/Instagram crop (603²); gear-header is a wide web banner.
 */
export interface SocialItem {
  /** stable key used by the carousel layout */
  slug: string
  /** filename in /public/samsung/social */
  file: string
  /** intrinsic px width (post-optimization) */
  w: number
  /** intrinsic px height */
  h: number
  alt: string
  /** short hover caption */
  caption: string
}

export const socialItems: SocialItem[] = [
  { slug: 'gold3', file: 'gold3.webp', w: 603, h: 603, alt: 'Galaxy S5 gold — front, edge, and back across five carriers', caption: 'Galaxy S5 · carrier lineup' },
  { slug: 'gold', file: 'gold.webp', w: 603, h: 603, alt: 'Galaxy S5 in gold, charcoal, and white, stacked', caption: 'Galaxy S5 · three finishes' },
  { slug: 'gold2', file: 'gold2.webp', w: 603, h: 603, alt: 'Galaxy S5 gold back — camera and dimpled texture macro', caption: 'Galaxy S5 · macro' },
  { slug: 'gear-header', file: 'gear-header.webp', w: 1327, h: 370, alt: 'Samsung Gear web banner — “The Next Big Thing Is Here”', caption: 'Gear · web banner' },
  { slug: 'gear-s-front', file: 'gear-s-front.webp', w: 603, h: 603, alt: 'Samsung Gear S smartwatch, front, on a blue gradient', caption: 'Gear S · social' },
  { slug: 'gear-s-angle', file: 'gear-s-angle.webp', w: 603, h: 603, alt: 'Samsung Gear S smartwatch at a three-quarter angle', caption: 'Gear S · angle' },
  { slug: 'men-fashion', file: 'men-fashion.webp', w: 603, h: 603, alt: 'Galaxy Note in hand showing a men’s fashion article', caption: 'Note · lifestyle' },
  { slug: 'att-note3', file: 'att-note3.webp', w: 603, h: 603, alt: 'Galaxy S4 + Gear holiday post, co-branded with AT&T', caption: 'Holiday · AT&T co-op' },
  { slug: 'bestbuy-holiday', file: 'bestbuy-holiday.webp', w: 603, h: 603, alt: 'Galaxy Note 10.1 holiday illustration post, co-branded with Best Buy', caption: 'Holiday · Best Buy co-op' },
  { slug: 's5-white-camera', file: 's5-white-camera.webp', w: 603, h: 603, alt: 'Galaxy S5 white back — camera macro', caption: 'Galaxy S5 · camera' },
  { slug: 'galaxy-tab-s', file: 'galaxy-tab-s.webp', w: 603, h: 603, alt: 'Samsung Galaxy Tab S — front display and slim profile', caption: 'Galaxy Tab S' },
]

export interface SamsungStat {
  /** numeric target the count-up animates to */
  value: number
  /** decimal places to render during/after the count-up (default 0) */
  decimals?: number
  prefix?: string
  /** rendered in Samsung blue after the number, e.g. "M" / "B" */
  suffix?: string
  label: string
  description: string
}

export const outcomes = {
  heading: 'THE TAKEAWAY',
  lead: 'Working on the Samsung team alongside incredible mentors was where I learned the skills that established my career: care for details, an eye for aesthetics, and what it means to work with a serious client.',
  stats: [
    {
      value: 100,
      suffix: '+',
      label: 'Social Mockups',
      description: 'Personal output over the run: photo edits and device composites for the brand’s social feed. The sample above is a small slice.',
    },
    {
      value: 4,
      label: 'Years on the Account',
      description: 'A first design job, on the Samsung Mobile account at Razorfish. Long enough to build production speed and brand discipline.',
    },
    {
      value: 1,
      prefix: '#',
      label: 'Smartphone Maker (Context)',
      description: 'For context, not credit: Samsung led global smartphone shipments through these years (IDC). It was a serious brand to learn on.',
    },
  ] as SamsungStat[],
  sources:
    'Context figure: IDC Worldwide Quarterly Mobile Phone Tracker (Samsung #1 by annual smartphone shipments, 2013–2017). Output figures are an estimate from the period.',
}
