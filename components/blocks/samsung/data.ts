/**
 * Samsung case study — content defaults.
 * Same pattern as the Panda/Wingstop builds: all copy lives here; the Payload
 * block only carries optional overrides. Outcomes stats sourced from public
 * reporting (verified June 2026):
 *  - IDC Worldwide Quarterly Mobile Phone Tracker (318.1M shipped 2014; #1 by
 *    annual shipments throughout 2013–2017)
 *  - Reuters / launch press, Oct 2013 (Galaxy S4: 40M in 6 months, 327
 *    carriers, 155 countries; fastest-selling Android of its time)
 *  - Samsung @ CES 2017 (Gear VR: 5M+ headsets in use)
 *  - Reuters, Nov 2013 ($14B marketing budget — "biggest in history")
 * The 8-launch count is biographical (S4→S7 edge, Note 3→7), not external.
 */

export const overview = {
  client: 'Samsung',
  dateRange: '2013 — 2017',
  lead: 'Before product systems and rewards programs, I was a designer inside the biggest consumer-electronics marketing machine on earth. At Razorfish, working on Samsung Mobile, I saw each new Galaxy before the world did — and helped build the launch pages, social content, and in-store experiences that introduced them to it.',
  role: 'Designer — Razorfish, for Samsung Mobile. Early career: launch and product pages for each new Galaxy under pre-announcement NDA, photo editing and mockups for Instagram and Facebook, and UI for in-store experiences — including an interactive table advertising Samsung’s VR, Gear, and phones.',
  scope: [
    'Launch & Product Pages',
    'Social Media Content',
    'Photo Editing & Mockups',
    'In-Store Experiences',
    'Interactive Table UI',
    'VR & Wearables',
  ],
}

export const brief = {
  heading: 'THE BRIEF',
  intro: 'Working on Samsung Mobile meant designing for three constraints at once: total secrecy before each announcement, day-one global scale after it, and a launch calendar that never stopped moving.',
  problems: [
    {
      tag: '01',
      title: 'Secrecy as a workflow',
      body: 'We saw each Galaxy before its announcement. Designing under NDA meant locked-down assets and launch pages built for phones that officially didn’t exist yet.',
    },
    {
      tag: '02',
      title: 'Day-one scale',
      body: 'Nothing shipped small. A product page went live to the world’s largest phone audience the moment a keynote ended — there was no soft launch, ever.',
    },
    {
      tag: '03',
      title: 'A calendar that never stops',
      body: 'Galaxy S in the spring, Note in the fall, Gear and VR in between. Every launch overlapped the next one’s prep, for four straight years.',
    },
  ],
}

export const work = {
  heading: 'THE WORK',
  intro: 'Three workstreams, one story per launch — the web pages that announced each phone, the social engine that kept it in the feed, and the retail experiences that put it in people’s hands.',
  rows: [
    {
      tag: 'LAUNCH & PRODUCT PAGES',
      title: 'Pages for phones that didn’t exist yet',
      body: 'For each new Galaxy — S4 through S7 edge, Note 3 through 7 — we designed the landing and product pages behind the keynote, ready to flip live the second the announcement ended.',
      placeholder: 'Launch page designs — in progress',
    },
    {
      tag: 'SOCIAL ENGINE',
      title: 'Feeding Instagram and Facebook',
      body: 'Photo editing and mockups for Samsung Mobile’s social channels — translating studio product shots into a daily stream of posts for one of the most-followed brands on either platform.',
      placeholder: 'Social content + mockups — in progress',
    },
    {
      tag: 'IN-STORE + TABLE UI',
      title: 'The table that sold the ecosystem',
      body: 'Interactive UI for an in-store table experience advertising Samsung’s VR, Gear wearables, and phones — retail theater guests could put their hands on, demoing the whole ecosystem in one surface.',
      placeholder: 'Table UI screens — in progress',
    },
  ],
  closer:
    'Four years, eight flagship launches, one lesson that stuck: design lands hardest when the whole machine — web, social, retail — tells a single story.',
}

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
  heading: 'OUTCOMES',
  lead: 'These aren’t my numbers — they’re the scale of the machine this work shipped inside. Four years designing for the largest audience in consumer tech.',
  stats: [
    {
      value: 1,
      prefix: '#',
      label: 'Smartphone Maker',
      description: 'Samsung led global smartphone shipments every year of this run (IDC).',
    },
    {
      value: 318,
      suffix: 'M',
      label: 'Phones Shipped, 2014',
      description: 'Annual shipments at the era’s peak — the audience every launch page served (IDC).',
    },
    {
      value: 40,
      suffix: 'M',
      label: 'Galaxy S4s in 6 Months',
      description: 'The fastest-selling Android phone of its time — launched on 327 carriers across 155 countries.',
    },
    {
      value: 5,
      suffix: 'M+',
      label: 'Gear VR Headsets',
      description: 'In use by CES 2017 — the device the in-store table UI demoed and sold.',
    },
    {
      value: 14,
      prefix: '$',
      suffix: 'B',
      label: 'Marketing Engine',
      description: 'Samsung’s 2013 marketing budget — reported at the time as the biggest in history.',
    },
    {
      value: 8,
      label: 'Flagship Launches',
      description: 'Galaxy S4 through S7 edge and Note 3 through 7 — each designed under pre-announcement NDA.',
    },
  ] as SamsungStat[],
  sources:
    'Sources: IDC Worldwide Quarterly Mobile Phone Tracker · Samsung / Reuters launch reporting, 2013 · Samsung @ CES 2017 · Reuters marketing reporting, 2013',
}
