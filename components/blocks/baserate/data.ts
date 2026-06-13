/**
 * Baserate case-study content, extracted from the Figma source.
 * Used as default props for the Payload blocks and by the standalone preview harness.
 * NOTE: body copy mirrors the Figma file — tweak wording here in one place.
 */

import { videoSrc } from './media'

const IMG = '/baserate'

export const overview = {
  client: 'BASERATE',
  dateRange: 'April 20, 2022 — April 19 2026',
  lead: 'Baserate is the investment operating system designed for family offices and modern investment teams.',
  role: 'Lead Product & Brand Designer',
  scope: [
    'Product Strategy',
    'UX Systems',
    'Branding',
    'AI Workflows',
    'Design Systems',
    'Implementation Collaboration',
  ],
}

export interface ChallengeCard {
  problem: number
  /** relative card width weight; bigger = wider */
  span: 'sm' | 'md' | 'lg'
  title: { text: string; accent?: boolean }[]
  body?: { text: string; accent?: boolean }[]
  image: string
  /** optional mobile-specific crop (near-square); shown below the lg breakpoint */
  mobileImage?: string
  /** dark photo bg needs light text + scrim; light UI bg needs dark text */
  tone: 'dark' | 'light'
}

export const challenge = {
  heading: 'THE CHALLENGE',
  intro: 'We identified 7 key problems in the process of investment teams.',
  cards: [
    {
      problem: 1,
      span: 'lg',
      tone: 'dark',
      image: `${IMG}/challenge/problem-1.webp`,
      mobileImage: `${IMG}/challenge/problem-1-mobile.webp`,
      title: [
        { text: 'CRITICAL RESEARCH IS ' },
        { text: 'FRAGMENTED', accent: true },
        { text: ' ACROSS TOOLS AND PEOPLE' },
      ],
    },
    {
      problem: 2,
      span: 'md',
      tone: 'dark',
      image: `${IMG}/challenge/problem-2.webp`,
      title: [{ text: 'INVESTORS FAIL TO RETAIN THEIR LEARNING.' }],
      body: [
        { text: 'Insights are created every day, but without a durable system, ' },
        { text: 'learning decays instead of accumulating.', accent: true },
      ],
    },
    {
      problem: 3,
      span: 'lg',
      tone: 'light',
      image: `${IMG}/challenge/problem-3.webp`,
      mobileImage: `${IMG}/challenge/problem-3-mobile.webp`,
      title: [
        { text: 'TEAMS LACK A ' },
        { text: 'LIVE, SHARED VIEW', accent: true },
        { text: ' OF THEIR ACTIVE WORK' },
      ],
    },
    {
      problem: 4,
      span: 'md',
      tone: 'dark',
      image: `${IMG}/challenge/problem-4.webp`,
      title: [
        { text: 'HIDDEN VIEWS', accent: true },
        { text: ' AND GROUPTHINK' },
      ],
      body: [
        { text: 'Early opinions anchor discussion, dissent goes quiet, and teams mistake consensus for clarity.' },
      ],
    },
    {
      problem: 5,
      span: 'md',
      tone: 'light',
      image: `${IMG}/challenge/problem-5.webp`,
      title: [{ text: 'OPEN FEEDBACK LOOPS' }],
      body: [
        { text: 'Past decisions rarely translate into ' },
        { text: 'durable learning.', accent: true },
      ],
    },
    {
      problem: 6,
      span: 'md',
      tone: 'dark',
      image: `${IMG}/challenge/problem-6.webp`,
      title: [{ text: "PROCESS THAT CAN'T BE DEMONSTRATED" }],
      body: [
        { text: 'Even strong process is ' },
        { text: 'hard to prove externally.', accent: true },
      ],
    },
    {
      problem: 7,
      span: 'md',
      tone: 'light',
      image: `${IMG}/challenge/problem-7.webp`,
      title: [
        { text: 'AI NEEDS A ' },
        { text: 'MEMORY.', accent: true },
      ],
      body: [
        { text: 'Investors need a unified record that can be utilized by local AI as well as accessed via MCP.' },
      ],
    },
  ] as ChallengeCard[],
}

export const architecture = {
  heading: 'PRODUCT ARCHITECTURE & STRATEGY',
  intro:
    "The structure of the MVP and following features needed to align with investor's current behaviors and expectations.",
  exploration: {
    tag: 'Exploration',
    items: [
      {
        title: 'WORKFLOW ANALYSIS',
        body: 'From research and interviews we identified the current behaviors and tools that defined an investors workflow.',
        image: `${IMG}/arch/workflow.webp`,
      },
      {
        title: 'DATA HIERARCHY',
        body: 'Charted out the structure of user data across tools, features, individuals and teams.',
        image: `${IMG}/arch/data-hierarchy.webp`,
      },
      {
        title: 'FEATURE ECOSYSTEM',
        body: 'Mapped out the ecosystem of features and how they would interact with each other.',
        image: `${IMG}/arch/feature-ecosystem.webp`,
      },
    ],
  },
  crystalization: {
    tag: 'Crystalization',
    image: `${IMG}/arch/crystalization.webp`,
    items: [
      {
        title: 'FEATURE PRIORITIZATION',
        body: 'List how many features, mock up like a roadmap timeline fading off into the distance.',
      },
      {
        title: 'OPERATIONAL COMPLEXITY',
        body: 'How do we balance simplicity for late adopters while enabling complexity for power users.',
      },
      {
        title: 'INFORMATION ARCHITECTURE',
        body: 'Overall structure of the site.',
      },
    ],
  },
}

export const productSystem = {
  heading: 'BUILDING THE PRODUCT SYSTEM',
  intro:
    'Explored, researched, iterated on and designed from concept to high fidelity UI and prototypes. Each new feature opened up opportunities for unique cross-feature integrations.',
  pills: ['70+ Full Features', 'Weekly Design Reviews', 'User Testing'],
  productsHeading: '2 PRODUCTS',
  productsIntro: 'Added brand differentiation to emphasize the value gain from the free to team product.',
  baserate: {
    emphasized: true,
    badge: 'Premium',
    tagline: 'B2B Operating System for Modern Investment Teams',
    sub: 'Full features that touch the entire investment process.',
    screenshot: `${IMG}/system/baserate-desktop-ui.webp`,
  },
  journalytic: {
    emphasized: false,
    tagline: 'B2C Tool Enabling Solo Investors to Build Profitable Habits.',
    sub: 'Paired down software useful for journaling and reflection.',
    phones: [`${IMG}/misc/phone-1.webp`, `${IMG}/misc/phone-2.webp`],
  },
}

export interface Feature {
  label: string
  icon: string // slug -> /baserate/icons/<slug>.svg
}

const feat = (label: string, icon: string): Feature => ({ label, icon })

export const featureSections = [
  {
    number: 1,
    title: 'RESEARCH AND RECORD',
    body: 'Investors gather information from everywhere — web, email, conversations, attachments. Baserate captures it all with consistent structure so it surfaces later in decisions.',
    features: [
      feat('Baserate Docs', 'baserate-docs'),
      feat('Highlighting Notes', 'highlighting-notes'),
      feat('Thesis Capture', 'thesis-capture'),
      feat('Entry Recording', 'entry-recording'),
      feat('Entry Actions', 'entry-actions'),
      feat('Indexing', 'indexing'),
      feat('Tag Management', 'tag-management'),
      feat('Research Projects', 'research-projects'),
      feat('Browser Extension', 'browser-extension'),
      feat('Email to App', 'email-to-app'),
      feat('Import CSV', 'import-csv'),
      feat('Content Transfer', 'content-transfer'),
    ],
  },
  {
    number: 2,
    title: 'EVALUATE RESEARCH & DECISIONS',
    body: 'A library of structured decision tools — checklists, conviction charts, pre-mortems, polls, predictions — so investors decide the same way every time and can audit themselves later.',
    features: [
      feat('Decision Builder', 'decision-builder'),
      feat('Decision Analysis Pages', 'decision-analysis-pages'),
      feat('Checklists', 'checklists'),
      feat('Checklist Library', 'checklist-library'),
      feat('Pre-Mortem', 'pre-mortem'),
      feat('Feeling Capture', 'feeling-capture'),
      feat('Predictions', 'predictions'),
      feat('Pairwise Rank', 'pairwise-rank'),
      feat('Forecast', 'forecast'),
      feat('Over/Under', 'over-under'),
      feat('Points Poll', 'points-poll'),
      feat('Hurdle Poll', 'hurdle-poll'),
      feat('Ranking Poll', 'ranking-poll'),
      feat('Voting Poll', 'voting-poll'),
      feat('Self Contract', 'self-contract'),
    ],
  },
  {
    number: 3,
    title: 'TRACK & MANAGE',
    body: 'Features around measuring and reporting user bias.',
    features: [
      feat('Idea Dashboard', 'idea-dashboard'),
      feat('Decision Analysis Pages', 'decision-analysis-pages-track'),
      feat('Manual Idea Lists', 'manual-idea-lists'),
      feat('Dynamic Idea Lists', 'dynamic-idea-lists'),
      feat('Idea Labels', 'idea-labels'),
      feat('Idea Alerts', 'idea-alerts'),
      feat('Trigger Alerts', 'trigger-alerts'),
      feat('Batch Alerts', 'batch-alerts'),
      feat('Kanban Boards', 'kanban-boards'),
      feat('Portfolio', 'portfolio'),
      feat('CRM', 'crm'),
      feat('Profiles', 'profiles'),
      feat('Data Tables', 'data-tables'),
      feat('Pair Trades', 'pair-trades'),
      feat('Reminders', 'reminders'),
    ],
  },
  {
    number: 4,
    title: 'COLLABORATE',
    body: 'Built so a partner, analyst, and IC member can work the same idea without losing each other.',
    features: [
      feat('Chat Platform', 'chat-platform'),
      feat('Forums', 'forums'),
      feat('Multiple Workspaces', 'multiple-workspaces'),
      feat('Permissions Settings', 'permissions-settings'),
      feat('File Management', 'file-management'),
      feat('External Linking', 'external-linking'),
      feat('Email Automations', 'email-automations'),
      feat('Notification Emails', 'notification-emails'),
      feat('AI Team Mates', 'ai-team-mates'),
      feat('Editor Modes', 'editor-modes'),
      feat('Activity Log', 'activity-log'),
      feat('Task Management', 'task-management'),
    ],
  },
  {
    number: 5,
    title: 'REFLECT AND CLOSE LOOPS',
    body: 'Closing the loop on every decision — post-mortems, summary reports, and year-in-reviews as first-class objects.',
    features: [
      feat('Post Mortem', 'post-mortem'),
      feat('Monthly Summary Reports', 'monthly-summary-reports'),
      feat('Year-In-Review', 'year-in-review'),
      feat('Mood Graph', 'mood-graph'),
      feat('AI Reporting', 'ai-reporting'),
      feat('Baserate AI', 'baserate-ai'),
      feat('Track Convictions', 'track-convictions'),
    ],
  },
  {
    number: 6,
    title: 'OS COMPLETION',
    body: 'This is where we added the security and functionality required to make the software viable.',
    features: [
      feat('Global Search', 'global-search'),
      feat('Context Specific Search', 'context-specific-search'),
      feat('Advanced Filtering', 'advanced-filtering'),
      feat('Advanced Shortcuts', 'advanced-shortcuts'),
      feat('Processes', 'processes'),
      feat('Admin Panel', 'admin-panel'),
      feat('2FA', '2fa'),
      feat('Dark Mode', 'dark-mode'),
      feat('Solitude Mode', 'solitude-mode'),
      feat('Help Center', 'help-center'),
      feat('MCP Connector', 'mcp-connector'),
      feat('Project Management', 'project-management'),
    ],
  },
]

/** The 3 staggered auto-scroll carousels, one above each pair of feature sections. */
export const featureCarousels = [
  {
    centerLabel: 'Decisions',
    centerIcon: 'decision-builder',
    video: videoSrc('decision-demo.mp4'),
    images: [`${IMG}/system/decision-builder.webp`, `${IMG}/system/baserate-docs.webp`],
    offset: 0,
    videoStart: 50, // skip the first 50s intro
  },
  {
    centerLabel: 'Idea Lists',
    centerIcon: 'mood-graph',
    video: videoSrc('baserate-idea-list-demo.mp4'),
    images: [`${IMG}/system/idea-lists.webp`, `${IMG}/system/tasks.webp`, `${IMG}/system/calendar.webp`],
    offset: 150,
    videoStart: 30, // skip the first 30s intro
  },
  {
    centerLabel: 'Conviction',
    centerIcon: 'track-convictions',
    video: videoSrc('conviction-demo-video.mp4'),
    images: [`${IMG}/system/reporting.webp`, `${IMG}/system/mood-graph.webp`, `${IMG}/system/chat.webp`],
    offset: 75,
    videoStart: 40, // skip the first 40s intro
  },
]

/* ============================================================
 * Design Systems & Implementation — the dark closing section.
 * Header + four panels: Component Libraries (artifact), Scalability
 * (3D receding timeline), Handoff (live UI + code box), AI Prototyping (TODO).
 * ============================================================ */

export const designSystems = {
  heading: 'DESIGN SYSTEMS & IMPLEMENTATION',
  components: {
    title: 'COMPONENT LIBRARIES',
    body: 'Full component libraries from icons to larger complex components',
    artifact: `${IMG}/components.webp`,
  },
  scalability: {
    title: 'SCALABILITY',
    body: 'Designed with future implementations in mind',
    /**
     * Screens float above a timeline that recedes into 3D space toward the
     * top-right. Front (index 0) = most recent / most complex, sharp and bright;
     * each step back gets smaller, dimmer and softer — the product's history
     * vanishing into the distance. `date` labels the dot on the timeline.
     */
    frames: [
      { image: `${IMG}/scalability/scalability-1.webp`, date: '2026' },
      { image: `${IMG}/scalability/scalability-2.webp`, date: '2027' },
      { image: `${IMG}/scalability/scalability-3.webp`, date: '2028' },
      { image: `${IMG}/scalability/scalability-4.webp`, date: '2029' },
      { image: `${IMG}/scalability/scalability-5.webp`, date: '2030' },
      { image: `${IMG}/scalability/scalability-6.webp`, date: '2031' },
    ],
  },
}

/* ------------------------------------------------------------------ */
/*  Outcomes — final section (Figma 91:44565), real metrics via Gemini */
/* ------------------------------------------------------------------ */

export interface OutcomeStat {
  /** numeric target the count-up animates to */
  value: number
  prefix?: string
  /** rendered in gold after the number, e.g. "B+" / "+" */
  suffix?: string
  label: string
  description: string
}

export const outcomes = {
  heading: 'OUTCOMES',
  lead: 'By designing an ecosystem that simplifies complex data and seamlessly integrates into intense, daily financial workflows, the products achieved massive market validation.',
  stats: [
    {
      value: 50,
      prefix: '$',
      suffix: 'B+',
      label: 'Total AUM',
      description: 'Enterprise interfaces trusted daily by firms managing billions across 6 countries.',
    },
    {
      value: 10000,
      suffix: '+',
      label: 'Investors',
      description: 'Low-friction UX that scaled the B2C platform to a global investor base.',
    },
    {
      value: 50,
      suffix: '+',
      label: 'Countries',
      description: 'Investors onboarded across every major market worldwide.',
    },
    {
      value: 40,
      suffix: '+',
      label: 'Pre-Launch Firms',
      description: 'A high-utility enterprise OS that closed major institutional clients before public launch.',
    },
    {
      value: 112,
      label: 'Features Shipped',
      description: 'Completed GitHub features — with 388 more on the roadmap.',
    },
  ] as OutcomeStat[],
  testimonialsHeading: 'TESTIMONIALS',
  testimonials: [
    {
      quote:
        '“Baserate is the one system we couldn’t replace. It’s the infrastructure for how we think, communicate, and make decisions.”',
      role: 'Chief Investment Officer',
      org: 'Family Office',
    },
    {
      quote:
        '“What we value most is the intellectual honesty it creates. We can look back and see what people actually believed at the time, not a revised story.”',
      role: 'Lead Portfolio Manager',
      org: 'Hedge Fund',
    },
    {
      quote:
        '“We’ve used expensive RMS and research systems and this has been more useful in practice. It changes how the work actually gets done.”',
      role: 'Portfolio Manager',
      org: 'Multi-PM Hedge Fund',
    },
  ],
  trustedByHeading: 'TRUSTED BY',
  logos: [
    { src: `${IMG}/logos/clients/gryphon-wealth.webp`, alt: 'Gryphon Wealth' },
    { src: `${IMG}/logos/clients/edgeworth-capital.webp`, alt: 'Edgeworth Capital' },
    { src: `${IMG}/logos/clients/enhancing-capital.webp`, alt: 'Enhancing Capital' },
    { src: `${IMG}/logos/clients/saber-capital.webp`, alt: 'Saber Capital Management' },
  ],
}
