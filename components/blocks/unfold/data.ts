/**
 * Unfold case study, v2. Rebuilt after positioning research (2026-08-10):
 * reviewers scan in seconds, so the whole page runs ~600 words, visual first,
 * caption led, outcome first. Precise attribution (I / KC / Neil) on purpose.
 * No em dashes anywhere. VisualPlaceholder blocks mark art Joshua will make.
 *
 * Facts verified against the project record (Dropbox "Unfold App"):
 * 14,024 word-study profiles / 378,375 occurrences / 913 batches / 8 rounds;
 * 10 subscription products, 14-day trials; 45 testers; 9 owner feedback
 * rounds; rejected 8/4, expedited approval granted 8/8. Launching Aug 2026.
 */

export const hero = {
  title: 'Unfold',
  lead: 'A Bible reading app, redesigned and shipped end to end by one designer directing a fleet of AI agents.',
  /** Flip to "live on the App Store" plus the store link on release day. */
  metaLine: 'Apr to Aug 2026 · iOS · launching August 2026',
  scope: ['Product Strategy', 'UX + UI', 'Content Systems', 'Full Build', 'App Store Launch'],
  mark: '/unfold/brand/unfold-mark.png',
  heroVideo: '/unfold/onboarding/dunes.mp4',
  keyArtPlaceholder: 'Launch key art: device cluster on the green brand, or one hero phone at angle',
}

export const numbers = {
  heading: 'In numbers',
  note: 'Shipped scope at launch. Store numbers join this row as they accrue.',
  stats: [
    { value: '100+', label: 'screens designed and built' },
    { value: '14,024', label: 'original word studies' },
    { value: '378,375', label: 'verse occurrences mapped' },
    { value: '10', label: 'products, all with 14-day trials' },
    { value: '4 days', label: 'from rejection to expedited approval' },
  ],
}

export const product = {
  heading: 'The product',
  intro: 'I designed and built every screen. A few of them:',
  cells: [
    {
      type: 'placeholder' as const,
      label: 'Before and after: one screen of the old app next to the same screen redesigned',
      aspect: '16 / 10',
      wide: true,
    },
    {
      type: 'screen' as const,
      src: '/unfold/store/iphone-01.webp',
      alt: 'The reader, Matthew 1',
      caption: 'Reading is one continuous flow. Mark complete lives in the scroll, not a menu.',
    },
    {
      type: 'screen' as const,
      src: '/unfold/store/iphone-07.webp',
      alt: 'Psalms book breakdown',
      caption: 'Every book opens with structure: summary, key verse, themes.',
    },
    {
      type: 'screen' as const,
      src: '/unfold/store/iphone-04.webp',
      alt: 'Commentary in the reader',
      caption: 'The verse tray brings study to the verse. You never leave the reader.',
    },
    {
      type: 'screen' as const,
      src: '/unfold/store/iphone-02.webp',
      alt: 'Day one welcome',
      caption: 'Day one is Neil on video, not a walkthrough. Research says tours get dismissed, so I cut ours.',
    },
    {
      type: 'screen' as const,
      src: '/unfold/store/iphone-05.webp',
      alt: 'Notes',
      caption: 'Notes with embedded scripture, folders, and sharing.',
    },
    {
      type: 'screen' as const,
      src: '/unfold/store/iphone-08.webp',
      alt: 'Home',
      caption: 'Home reports your habit: streak, plan, daily verse.',
    },
    {
      type: 'placeholder' as const,
      label: 'Screen recording: verse tray, swipe actions, mark complete in motion',
      aspect: '9 / 16',
    },
    {
      type: 'screen' as const,
      src: '/unfold/ipad/ipad-01.webp',
      alt: 'iPad split screen',
      caption: 'iPad split screen, from discovery doc to working mockup.',
      wide: true,
    },
  ],
}

export const library = {
  heading: 'The study library',
  intro:
    'Deep Dive is the moat: an original word study for the whole Bible, written in Neil’s voice. I designed the system that wrote it. Parallel agent sessions on a shared queue, eight editorial rounds, one voice.',
  stats: [
    { value: '14,024', label: 'word studies' },
    { value: '378,375', label: 'occurrences mapped' },
    { value: '66', label: 'book guides' },
    { value: '8', label: 'editorial rounds' },
  ],
  screenshot: '/unfold/store/iphone-03.webp',
  screenshotAlt: 'The θεός (Theos) word study',
  caption: 'Tap a word, get its story: meaning, every occurrence, a takeaway written like a person.',
  systemMapPlaceholder: 'System map: shared queue, agent sessions, editorial rounds, app payload',
}

export const shipped = {
  heading: 'How it shipped',
  intro: 'Most portfolio work stops at handoff. This shipped.',
  steps: [
    { n: '01', title: 'Discovery docs', body: 'Research before pixels.' },
    { n: '02', title: 'Working prototypes', body: 'Decisions made on built HTML.' },
    { n: '03', title: 'Build on branch', body: 'I ship what I design, front and back end.' },
    { n: '04', title: 'Canary device', body: 'On real hardware in minutes, over the air.' },
    { n: '05', title: 'TestFlight to store', body: '45 testers, 9 owner rounds, freeze rules.' },
  ],
  povLine: 'The distance from decided to on-a-phone is minutes, not sprints.',
  artifactsPlaceholder: 'Receipts collage: a discovery doc, an HTML prototype, the canary phone',
  timeline: [
    { date: 'Jun 30', event: 'Build and OTA pipeline stood up.' },
    { date: 'Jul', event: 'Store presence built. Ten products, 175 territories.' },
    { date: 'Aug 4, 8am', event: 'Rejected, 2.1(b). Root-caused by noon.' },
    { date: 'Aug 4, pm', event: 'Fixed and resubmitted the same day.' },
    { date: 'Aug 8', event: 'Expedited review requested and granted.' },
    { date: 'Aug 2026', event: 'Launch. Manual release, runbook staged.' },
  ],
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
  storeStripLabel: 'The store set, as shipped',
}

export const business = {
  heading: 'The business layer',
  intro:
    'Ten products, every one on a 14-day free trial, stated plainly. Email capture sits after the purchase decision, not in front of it. No dark patterns.',
  tiers: ['Individual', 'Two-person', 'Household', 'Lifetime'],
  roundsPlaceholder: 'The paywall: final screen, plus the three built rounds side by side',
}

export const credits = {
  heading: 'Credits and what’s next',
  roles: [
    { who: 'Joshua', did: 'designed and built the app. UX, UI, front end, back end, the content system, and the store submission.' },
    { who: 'KC', did: 'built the original app, the logo, and the website.' },
    { who: 'Neil Broere', did: 'owns Unfold. The vision and the voice are his.' },
  ],
  metricsNote: 'App Store rating, downloads, and members get added here as they accrue.',
  reflection:
    'One person can now carry a product from research to release. That is the engagement I offer.',
  cta: { label: 'Work with me', href: '/contact' },
  testimonial: null as null | { quote: string; name: string; title: string },
}
