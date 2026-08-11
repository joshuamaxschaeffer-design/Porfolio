/**
 * Unfold case study — content defaults.
 * Same pattern as Panda/Wingstop: all copy lives here; the Payload block only
 * carries optional overrides.
 *
 * The story this page must carry (and nothing else on the site does):
 * end-to-end ownership of a live consumer product — UX, brand, content
 * systems, code, and the App Store launch — by one designer directing a
 * fleet of AI agents.
 *
 * Facts sourced from the project record (Dropbox "Unfold App", verified
 * 2026-08-10): 14,024 word-study profiles / 378,375 mapped occurrences /
 * 913 content buckets through 8 editorial rounds; 10 subscription products
 * with 14-day trials; 45 TestFlight testers; 9 rounds of owner feedback;
 * 2.1(b) rejection root-caused 8/4 → resubmitted same day → expedited
 * review granted 8/8. Launch: August 2026, v1.0.1.
 *
 * Imagery: /public/unfold/* (store set optimized from the ASC 6.5" V01
 * screenshots; brand mark from the icon master; textures from the app's
 * background set).
 */

export const palette = {
  green: '#349c72',
  greenDeep: '#27795a',
  cream: '#fff6e8',
  creamDim: '#f5ede0',
  charcoal: '#1c1a17',
  charcoal2: '#262420',
  inkWarm: '#3a342e',
  mutedWarm: '#73685c',
  oldOrange: '#db4a2b',
}

export const overview = {
  client: 'Unfold',
  dateRange: 'Apr – Aug 2026',
  lead: 'A Bible reading app rebuilt end to end — every screen, the brand, a 14,000-entry study library, and the launch itself.',
  role:
    'Product designer & builder. I owned UX, UI, and brand — and built what I designed, front end and back end, directing a fleet of AI agent sessions. Neil Broere (owner) set the vision and voice; I shipped it.',
  scope: [
    'Product Strategy',
    'UX / UI',
    'Brand & Identity',
    'Content Systems',
    'Front + Back End Build',
    'App Store Launch',
  ],
  heroVideo: '/unfold/onboarding/dunes.mp4',
  mark: '/unfold/brand/unfold-mark.png',
}

export const facts = {
  intro:
    'Numbers at launch — the shipped scope, not vanity metrics. Store numbers get added here as they accrue.',
  stats: [
    { value: '100+', label: 'screens designed and built', note: 'every surface in the app' },
    { value: '14,024', label: 'original word-study profiles', note: '378,375 verse occurrences mapped' },
    { value: '10', label: 'subscription products architected', note: '14-day trials on every one' },
    { value: '45', label: 'beta testers through launch', note: 'nine rounds of owner feedback' },
    { value: '8', label: 'editorial rounds on the study library', note: 'one voice across 913 batches' },
    { value: '4', label: 'days from rejection to expedited approval', note: 'root-caused, fixed, resubmitted' },
  ],
}

export const context = {
  intro:
    'Unfold is Neil Broere’s Bible reading app — structured plans with his teaching woven through. The idea and the audience were real. The product underneath them needed work.',
  body: [
    'When I joined in spring 2026 the app worked, but it read as a template: default navigation, flat hierarchy, an orange brand that fought the content, and teaching material locked inside screens that didn’t invite reading.',
    'The brief started as “help with the UX.” It became: own all of it. Redesign every screen, rebuild the brand, design the business model, write the study content system, build the features — client and server — and carry the app through App Store review.',
  ],
  screenshot: '/unfold/store/iphone-02.webp',
  screenshotAlt: 'Day-one welcome card with a video message from Neil',
}

export const model = {
  intro:
    'The part of this project that changes what a design engagement can be: one designer, working as director of a fleet of AI agent sessions, shipping at the pace of a small team.',
  steps: [
    {
      n: '01',
      title: 'Discovery docs',
      body: 'Every feature started as a written discovery pass — research, competitive context, and a recommendation. Onboarding, iPad split-screen, and the weekly rhythm each got one before any pixels.',
    },
    {
      n: '02',
      title: 'Interactive prototypes',
      body: 'Decisions were made on working HTML prototypes, not static mockups — the paywall alone went through three built rounds of design and copy before a line of production code.',
    },
    {
      n: '03',
      title: 'Build on-branch',
      body: 'I built what I designed — React Native front end, Node/Postgres back end — with agent sessions doing the typing while I directed, reviewed, and edited.',
    },
    {
      n: '04',
      title: 'Canary device',
      body: 'Every change went over-the-air to a canary iPhone within minutes, verified on real hardware before testers ever saw it.',
    },
    {
      n: '05',
      title: 'TestFlight → App Store',
      body: '45 testers, nine feedback rounds from the owner, freeze discipline before review, and a launch runbook for approval day.',
    },
  ],
  fleetNote:
    'The content system ran the same way at larger scale: parallel agent sessions pulled work from a shared queue with claim files — the same coordination pattern engineering teams use — while I set the spec, judged the output, and rewrote the rules each round. My job shifted from making each artifact to designing the system that makes them.',
}

export const rebrand = {
  intro:
    'The old brand was a hot orange on cream — loud, and unrelated to the reading experience. The rebrand went the other way: a flat green that can sit quietly next to scripture for an hour.',
  before: { color: '#db4a2b', label: 'Before — orange, default type, template UI' },
  after: { color: '#349c72', label: 'After — green + cream, warm charcoal dark mode' },
  mark: '/unfold/brand/unfold-mark.png',
  iconGrid: '/unfold/brand/icon-preview.webp',
  body: [
    'The mark is an open book, drawn flat in cream on green. It scales from a 1024-px store icon to a 20-px tab glyph without losing its shape, and the same two colors carry the splash screens, the store presence, and the app’s empty states.',
    'Type follows the same logic: a workhorse sans for UI, a serif reserved for scripture — so the text you came to read is the only thing set differently.',
    'Warm paper textures replace flat fills on key surfaces. Light mode reads as cream paper; dark mode as charcoal — not gray — so long reading sessions feel like a book, not a terminal.',
  ],
  textures: ['/unfold/texture/paper-cream.webp', '/unfold/texture/paper-charcoal.webp'],
}

export const reader = {
  intro:
    'The reader is the product. Everything else in the app exists to get you here and keep you here.',
  features: [
    {
      title: 'Four-tab glass nav',
      body: 'The old grid of entry points became four tabs on a translucent bar — Home, Bible, Journal, You — with the reader always one tap away.',
    },
    {
      title: 'Continuous reading flow',
      body: 'Full-width text, chapter-to-chapter momentum, and mark-complete built into the scroll — finishing a session doesn’t require leaving it.',
    },
    {
      title: 'The verse tray',
      body: 'Tap a verse and a tray slides up with notes, Deep Dive words, cross-references, and sharing — study tools arrive at the verse, instead of the verse leaving the reader.',
    },
    {
      title: 'Book breakdowns',
      body: 'Every book opens with a structured breakdown — summary, key verse, themes — so a reading plan lands you somewhere with context, not at a wall of text.',
    },
  ],
  screens: [
    { src: '/unfold/store/iphone-01.webp', alt: 'The reader — Matthew 1 in dark mode' },
    { src: '/unfold/store/iphone-07.webp', alt: 'Psalms book breakdown' },
    { src: '/unfold/store/iphone-04.webp', alt: 'A commentary note surfaced in the reader' },
  ],
}

export const onboarding = {
  intro:
    'Onboarding got a research pass before a design pass — and the research said to delete most of it.',
  body: [
    'The obvious move was a walkthrough tour. The evidence is against it: instructional overlays test poorly and get dismissed unread, so I cut the tour and built contextual discovery tips instead — the app teaches each tool the first time you’re actually near it.',
    'Day one opens with something better than instructions: Neil, on video, saying what the app is for. The welcome cards set the tone, the dunes film breathes behind the flow, and the first session ends in the reader — not in a settings screen.',
  ],
  screens: [
    { src: '/unfold/store/iphone-02.webp', alt: 'Welcome card with Neil’s video message' },
    { src: '/unfold/onboarding/neil-welcome.webp', alt: 'Day-one welcome poster frame' },
  ],
}

export const business = {
  intro:
    'A ministry product still has to sustain itself. I designed the business layer with the same care as the reader — and no dark patterns.',
  tiers: [
    { name: 'Individual', note: 'monthly · annual' },
    { name: 'Two-person', note: 'monthly · annual' },
    { name: 'Household', note: 'monthly · annual' },
    { name: 'Lifetime', note: 'one-time, seat-managed' },
  ],
  body: [
    'Ten products, one rule: every subscription starts with a 14-day free trial, stated plainly on the paywall. Pricing went through three built rounds of design and copy — headline, framing, and price anchoring tested as working screens.',
    'Email capture sits after the purchase decision, not in front of it — every trial-starter is reachable, and nobody bounces off a form to get to the app. Promo and gift codes ship at launch for testers and giveaways, and lifetime seats carry a churn cap so a one-time price can’t quietly become free-for-everyone.',
  ],
  screenshot: '/unfold/onboarding/neil-paywall.webp',
  screenshotAlt: 'The paywall — “Take 2 weeks.” with Neil’s poster frame',
}

export const deepdive = {
  intro:
    'Deep Dive is the reason Unfold isn’t “another reading app”: an original word-study library covering the whole Bible, written for this product in the owner’s voice.',
  stats: [
    { value: '14,024', label: 'word-study profiles' },
    { value: '378,375', label: 'verse occurrences mapped' },
    { value: '66', label: 'book context guides' },
    { value: '8', label: 'editorial rounds to one voice' },
  ],
  body: [
    'Tap θεός in the reader and you get its profile: transliteration and pronunciation, what the word meant to the people who wrote it, every place it appears, and a takeaway written like a person — not a lexicon entry.',
    'The library was produced by the agent fleet against a shared queue — 913 batches, claim files, parallel sessions — and rewritten through eight editorial rounds as the spec sharpened: longer overviews, scene-driven insights, strict transliteration rules, homograph handling.',
    'Around the word studies sit the same system’s siblings: context guides for all 66 books, public-domain commentaries rewritten into modern English at two reading levels, and church-father quotations recovered from public-domain sources so every attribution is real.',
  ],
  screenshot: '/unfold/store/iphone-03.webp',
  screenshotAlt: 'Deep Dive — the θεός (Theos) word study',
}

export const beyond = {
  intro: 'Around the core, a full product’s worth of systems — each designed, built, and shipped the same way.',
  items: [
    {
      title: 'Notes & folders',
      body: 'A complete note system with embedded scripture, folders, and sharing — your study in one place, not scattered across screenshots.',
      src: '/unfold/store/iphone-05.webp',
    },
    {
      title: 'Scripture-aware editor',
      body: 'Type a reference and the verse embeds itself, formatted and linked. Notes and whole folders share cleanly.',
      src: '/unfold/store/iphone-06.webp',
    },
    {
      title: 'iPad split screen',
      body: 'A discovery pass and working mockups for reading alongside notes — the tablet layout the content deserves.',
      src: '/unfold/ipad/ipad-01.webp',
      wide: true,
    },
    {
      title: 'Home that tracks your study',
      body: 'Streaks, plan progress, the daily verse, and what’s next — a dashboard that reports your habit instead of nagging it.',
      src: '/unfold/store/iphone-08.webp',
    },
  ],
  textItems: [
    {
      title: 'Weekly rhythm',
      body: 'Monday Forecast and Sabbath Reflection — a designed week, prototyped as interactive mockups and staged for post-launch.',
    },
    {
      title: 'Journal + sharing backends',
      body: 'Spec to schema to deploy: journal storage, shared folders with facepiles and an activity feed, and a usage dashboard for the team.',
    },
  ],
}

export const shipping = {
  intro:
    'The unglamorous mile most design portfolios skip: getting a real app through Apple review, twice, on a deadline.',
  timeline: [
    { date: 'Jun 30', event: 'Build + OTA pipeline stood up — EAS builds, preview channel, canary device loop.' },
    { date: 'Jul', event: 'Store presence built: screenshots, metadata, IAP review assets, demo account. Ten products configured across 175 territories.' },
    { date: 'Aug 4, 8 AM', event: 'Rejected — 2.1(b). The review build was a preview-environment binary. Root-caused by noon.' },
    { date: 'Aug 4, PM', event: 'Resubmitted: production profile, kill-switch, fixes. Freeze rules in force from here.' },
    { date: 'Aug 8', event: 'Expedited review requested and granted. Back in the queue with priority.' },
    { date: 'Aug 2026', event: 'v1.0.1 approved for launch — manual release, runbook staged, content payload ready to load.' },
  ],
  note:
    'Release discipline was part of the design: freeze rules while review was active, a canary phone serving the exact launch line, and an approval-day runbook so going live is a checklist, not a scramble.',
  storeStrip: [
    '/unfold/store/iphone-01.webp',
    '/unfold/store/iphone-02.webp',
    '/unfold/store/iphone-03.webp',
    '/unfold/store/iphone-04.webp',
    '/unfold/store/iphone-05.webp',
    '/unfold/store/iphone-06.webp',
    '/unfold/store/iphone-07.webp',
    '/unfold/store/iphone-08.webp',
  ],
}

export const outcomes = {
  intro: 'Launched August 2026. This section grows as the store numbers do.',
  atLaunch: [
    { value: 'Every screen', label: 'of the app designed & built by one person + an agent fleet' },
    { value: '14k-entry', label: 'study library no competitor at this scale has' },
    { value: '~4 months', label: 'from first discovery doc to App Store' },
  ],
  placeholders: 'App Store rating · downloads · trial starts · member counts — added as they accrue.',
  reflection: [
    'Unfold is what a design engagement looks like when one person can carry a product from research to release: the craft decisions and the build decisions stop being separate meetings, and the distance from “decided” to “on a phone” drops to minutes.',
    'That operating model — designer as director of an agent fleet — is the part I’d bring to whatever’s next.',
  ],
  testimonial: null as null | { quote: string; name: string; title: string },
}
