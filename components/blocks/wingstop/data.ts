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
  dateRange: '2019–2022',
  lead: 'I led the redesign of Wingstop’s ordering experience across mobile, web, and in-store, built around flavor.',
  role: 'Lead Designer & Art Director (Hathway, now Bounteous). I owned the UX and art direction end to end, then led and mentored a team of designers who built it out across platforms, campaigns, and in-store screens.',
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

/**
 * SECTION 1 — Scope. A draggable, equal-height carousel of every workstream,
 * modelled on the Panda "Full Rewards App" rail (RewardsPlatformSection):
 * native scroll + mouse-drag momentum + jump-pills. Topic = the scope of
 * everything done across Wingstop's digital presence.
 */
export const scope = {
  eyebrow: 'THE SCOPE',
  heading: 'Every part of the digital experience',
  intro: 'One flavor-first system across the native app, the website, in-store screens, and a year of campaigns. Drag through it.',
  pills: ['MVP App', 'Desktop Site', 'CRM', 'Flavor Pages', 'Branding', 'In-Store', 'UI Updates', 'Web Needs'],
  modules: [
    {
      key: 'mvp',
      tone: 'green', // solid green background
      eyebrow: 'MVP APP',
      title: 'Wingstop App',
      body: 'The native ordering app, designed mobile-first across the whole flow.',
      device: '/wingstop/hero2/device-home.webp',
    },
    {
      key: 'desktop',
      eyebrow: 'DESKTOP SITE',
      title: 'The full website',
      body: 'The ordering experience scaled to desktop, end to end.',
      desktop: '/wingstop/desktopapp/d-product.webp',
    },
    {
      key: 'crm',
      eyebrow: 'CRM',
      title: 'A year of campaigns',
      body: 'A modular email system powering promotions, delivery, and onboarding.',
      emails: [
        '/wingstop/crm/crm-25days.webp',
        '/wingstop/crm/crm-bignight.webp',
        '/wingstop/crm/crm-biggame.webp',
      ],
    },
    {
      key: 'flavor',
      eyebrow: 'FLAVOR PAGES',
      title: 'Flavor-first menu',
      body: 'Photography-forward pages that make every flavor the hero.',
      desktop: '/wingstop/flavor/d-lemon-pepper.webp',
    },
    {
      key: 'branding',
      eyebrow: 'BRANDING',
      title: 'A flavor icon system I designed',
      body: 'I designed an original icon for every flavor, matched to the Wingstop brand language.',
      icons: [
        '/wingstop/flavor-icons-designed/atomic-bbq.png',
        '/wingstop/flavor-icons-designed/bayou-bbq.png',
        '/wingstop/flavor-icons-designed/dragon-breath.png',
        '/wingstop/flavor-icons-designed/hot-lemon.png',
        '/wingstop/flavor-icons-designed/lemon-garlic.png',
        '/wingstop/flavor-icons-designed/mango-volcano.png',
      ],
    },
    {
      key: 'instore',
      eyebrow: 'IN-STORE',
      title: 'Digital menu boards',
      body: 'Vertical and horizontal screens, implemented in restaurants.',
      boards: ['/wingstop/instore/board-1.webp', '/wingstop/instore/board-2.webp'],
    },
    {
      key: 'ui',
      eyebrow: 'UI UPDATES',
      title: 'A full dark mode',
      body: 'The whole app re-themed so the food photography only got richer.',
      devices: [
        '/wingstop/darkmode/dm-2.webp',
        '/wingstop/darkmode/dm-1.webp',
        '/wingstop/darkmode/dm-3.webp',
      ],
    },
    {
      key: 'web',
      eyebrow: 'ADDITIONAL WEB NEEDS',
      title: 'Everything around it',
      body: 'Store-finder, location, and supporting pages across the site.',
      stacked: ['/wingstop/location/loc-1.webp', '/wingstop/location/loc-finder.webp'],
    },
  ],
}

/**
 * SECTION 2 — Wingstop App (green field). A feature carousel (key features as
 * pages, 3-go-right like Panda rewards) + a Component Library card + the desktop
 * site + a bento of all the app work using App Store release imagery.
 */
export const app = {
  eyebrow: 'THE WINGSTOP APP',
  heading: 'The native ordering app, end to end',
  intro: 'I designed the full ordering experience as a system of features. Browse, customize, cart, account, then built the component library that kept it consistent.',
  pills: ['Ordering', 'Customization', 'Cart & Checkout', 'Components', 'Desktop'],
  /** A few KEY features, each shown as app screens (3-go-right carousel). */
  features: [
    {
      eyebrow: 'ORDERING',
      title: 'Browse and build an order',
      body: 'The core flow: pick wings, flavors, sides and drinks, with photography leading every step.',
      screens: [
        '/wingstop/mobileapp/m-flavors.webp',
        '/wingstop/mobileapp/m-product.webp',
        '/wingstop/mobileapp/m-customize.webp',
        '/wingstop/product/m-product-1.webp',
        '/wingstop/product/m-product-2.webp',
      ],
    },
    {
      eyebrow: 'FLAVOR CUSTOMIZATION',
      title: 'Customize by flavor and heat',
      body: 'Split the count across flavors, set sides, and upgrade. The whole build-your-meal experience.',
      screens: [
        '/wingstop/mobileapp/m-customize.webp',
        '/wingstop/mobileapp/m-flavor-customize.webp',
        '/wingstop/mobileapp/m-eclub.webp',
        '/wingstop/product/m-product-3.webp',
        '/wingstop/product/m-product-4.webp',
      ],
    },
    {
      eyebrow: 'CART & CHECKOUT',
      title: 'From cart to confirmed',
      body: 'A streamlined cart, special requests, and a checkout that gets out of the way.',
      screens: [
        '/wingstop/product/m-cart.webp',
        '/wingstop/mobileapp/m-checkout-extra.webp',
        '/wingstop/mobileapp/m-product.webp',
        '/wingstop/mobileapp/m-flavors.webp',
        '/wingstop/mobileapp/m-done.webp',
      ],
    },
  ],
  /** Component library card (Panda/Baserate style). */
  components: {
    eyebrow: 'COMPONENT LIBRARY',
    title: 'The component library',
    body: 'A library of buttons, inputs, flavor chips, cards and bars, so the team could ship feature after feature on-brand.',
    swatches: ['#00843D', '#23c265', '#0c0d0d', '#f1b228', '#ffffff'],
    icons: [
      '/wingstop/flavor-icons/atomic.svg',
      '/wingstop/flavor-icons/lemon-pepper.svg',
      '/wingstop/flavor-icons/garlic-parm.svg',
      '/wingstop/flavor-icons/hawaiian.svg',
    ],
  },
  /** Desktop site — a mockup or two stacked (real product/ordering page first). */
  desktop: {
    eyebrow: 'DESKTOP SITE',
    title: 'Scaled to the web',
    body: 'The same ordering system, reflowed for desktop.',
    screens: ['/wingstop/desktopapp/d-product.webp', '/wingstop/desktopapp/d-flavors.webp'],
  },
  /** Bento of all the app work — App Store release imagery. */
  bento: {
    eyebrow: 'SHIPPED',
    title: 'Live on the App Store',
    body: 'The app launched in 2019 and became the highest-rated way to order Wingstop.',
    images: [
      '/wingstop/appstore/x-1.webp',
      '/wingstop/appstore/x-2.webp',
      '/wingstop/appstore/x-3.webp',
      '/wingstop/appstore/x-4.webp',
      '/wingstop/appstore/x-5.webp',
    ],
  },
}

/**
 * SECTION 3 — CRM. Module 1: the scope of all CRM work as a scroll-driven
 * sliding row of email mockups (taller, with top-down food). Module 2: the
 * modular/animated side as a Samsung-style grid carousel of CRM gifs (white).
 */
export const crmSection = {
  eyebrow: 'CRM',
  heading: 'A modular email system, a year of campaigns',
  intro: 'I designed a modular CRM system so the team could assemble campaign after campaign from shared blocks. Promotions, delivery, game-day, onboarding.',
  /** Scroll-slide row of all the email work. */
  scope: {
    eyebrow: 'THE SCOPE',
    title: 'Campaign after campaign',
    emails: [
      '/wingstop/crm/crm-25days.webp',
      '/wingstop/crm/crm-60wings.webp',
      '/wingstop/crm/crm-5off.webp',
      '/wingstop/crm/crm-bignight.webp',
      '/wingstop/crm/crm-biggame.webp',
      '/wingstop/crm/crm-freedelivery.webp',
      '/wingstop/crm/crm-welcome.webp',
    ],
    food: ['/wingstop/food/top-wings.webp', '/wingstop/food/top-fries.webp', '/wingstop/food/top-sauce.webp'],
  },
  /** Modular + animated: a grid carousel of the CRM gifs. */
  animated: {
    eyebrow: 'MODULAR & ANIMATED',
    title: 'Animated for the inbox',
    body: 'Animated modules, flavor reveals, emoji reactions, explosions, that made the emails pop in the inbox.',
    gifs: [
      { src: '/wingstop/crmgif/flavor-combos.gif', label: 'Flavor combos' },
      { src: '/wingstop/crmgif/face-emoji.gif', label: 'Emoji reactions' },
      { src: '/wingstop/crmgif/explosion.gif', label: 'Flavor explosion' },
      { src: '/wingstop/crmgif/zoom.gif', label: 'Delivery zoom' },
    ],
  },
}

/**
 * SECTION 4 — Flavor Pages. Cinematic BLACK section: 3 flavor pages mocked in
 * perspective (Samsung "Product and landing pages" style) + a module with the
 * Lemon Pepper flavor-page video, autoplaying on arrival.
 */
export const flavorPages = {
  eyebrow: 'FLAVOR PAGES',
  heading: 'Flavor, art-directed',
  intro: 'Photography-forward flavor pages that turn the menu into a reason to order. I art-directed the whole set, from the heat scale to the hero shots.',
  pages: [
    '/wingstop/flavor/d-lemon-pepper.webp',
    '/wingstop/flavor/d-garlic-parm.webp',
    '/wingstop/flavor/d-louisiana-rub.webp',
  ],
  video: {
    eyebrow: 'IN MOTION',
    title: 'The pages animated on scroll',
    body: 'The flavor pages animated as you scrolled. Here is the Lemon Pepper page in motion.',
    src: '/wingstop/video/flavor-lemon-pepper.mp4',
    poster: '/wingstop/flavor/m-lemon-pepper.webp',
  },
}

/** SECTION 6 — In-Store screens (2 tall boards side by side). */
export const inStoreSection = {
  eyebrow: 'IN-STORE SCREENS',
  heading: 'Designed for the wall, too',
  intro: 'The flavor-first system reached the restaurants. I designed the digital menu boards, vertical and horizontal, that were implemented in stores.',
  boards: [
    { src: '/wingstop/instore/board-1.webp', label: 'Combos & group packs' },
    { src: '/wingstop/instore/board-2.webp', label: 'Extras & drinks' },
  ],
}

/** SECTION 8 — Additional web needs (Samsung-style grid carousel). */
export const webNeeds = {
  eyebrow: 'ADDITIONAL WEB NEEDS',
  heading: 'Everything around the order',
  intro: 'Beyond the core experience, the team and I shipped the supporting surfaces across the site. Store-finder, locations, and careers.',
  items: [
    { src: '/wingstop/webneeds/d-locations.webp', label: 'Locations' },
    { src: '/wingstop/webneeds/d-storefinder.webp', label: 'Store finder' },
    { src: '/wingstop/webneeds/d-menu.webp', label: 'Menu' },
    { src: '/wingstop/webneeds/d-careers-welcome.webp', label: 'Careers' },
    { src: '/wingstop/webneeds/d-careers-restaurant.webp', label: 'Restaurant careers' },
    { src: '/wingstop/webneeds/d-careers-corporate.webp', label: 'Corporate careers' },
  ],
}

/** SECTION 10 — App Store release (download link + Group 12 mockup right). */
export const appStore = {
  eyebrow: 'SHIPPED',
  heading: 'Live on the App Store',
  intro: 'The flavor-first app launched in 2019 and became one of the highest-rated ways to order in the category.',
  mockup: '/wingstop/appstore/group-12.webp',
  appStoreUrl: 'https://apps.apple.com/us/app/wingstop/id556467500',
  googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.wingstop',
}

/**
 * SECTION 5 — Branding. The flavor icons as dimensional 3D chips that rotate
 * subtly on scroll (SD-Studio-style; CSS-3D stand-in for now), then a flat grid
 * noting they had to match Wingstop's existing icon style.
 */
export const branding = {
  eyebrow: 'BRANDING',
  heading: 'A flavor icon system, in three dimensions',
  intro: 'Every flavor needed its own mark. I designed an icon for each one and matched it to Wingstop’s existing icon language, then rendered them as a dimensional set.',
  /** Real 3D chip renders (SD Studio): each flavour's actual glyph embossed on
   *  a dimensional flavour-coloured coin. Replaces the CSS-3D stand-in. */
  chips: [
    { src: '/wingstop/flavor-chips/atomic-bbq.png', name: 'Atomic BBQ', color: '#006938' },
    { src: '/wingstop/flavor-chips/bayou-bbq.png', name: 'Bayou BBQ', color: '#006938' },
    { src: '/wingstop/flavor-chips/dragon-breath.png', name: 'Dragon Breath', color: '#006938' },
    { src: '/wingstop/flavor-chips/hot-lemon.png', name: 'Hot Lemon', color: '#006938' },
    { src: '/wingstop/flavor-chips/lemon-garlic.png', name: 'Lemon Garlic', color: '#006938' },
    { src: '/wingstop/flavor-chips/mango-volcano.png', name: 'Mango Volcano', color: '#006938' },
  ],
  gridEyebrow: 'MATCHED TO THE BRAND',
  gridNote: 'Wingstop’s existing flavor-icon language — the system I designed mine to sit alongside.',
  grid: [
    '/wingstop/flavor-icons/hawaiian.svg',
    '/wingstop/flavor-icons/lemon-pepper.svg',
    '/wingstop/flavor-icons/garlic-parm.svg',
    '/wingstop/flavor-icons/mild.svg',
    '/wingstop/flavor-icons/original-hot.svg',
    '/wingstop/flavor-icons/louisiana-rub.svg',
    '/wingstop/flavor-icons/cajun.svg',
    '/wingstop/flavor-icons/spicy-korean.svg',
    '/wingstop/flavor-icons/mango-habanero.svg',
    '/wingstop/flavor-icons/bbq.svg',
    '/wingstop/flavor-icons/old-bay.svg',
    '/wingstop/flavor-icons/atomic.svg',
  ],
}

/**
 * SECTION 7 — UI/UX Updates. Module 1: a 4-flow UX diagram (Panda Loyalty-QR
 * style) with arrows screen→screen and screens revealed on hover. Module 2:
 * dark mode as a receding stack (Baserate Scalability style, black). Module 3:
 * "UI improvement" — Panda side-scroll carousel of 3 screens + autoplay video.
 */
export const uiux = {
  eyebrow: 'UI/UX UPDATES',
  heading: 'The UX work underneath',
  intro: 'The redesign was built on real UX work: flows for every key task, a full dark mode, and a measurable usability overhaul.',
  flows: [
    {
      name: 'Hub-and-spoke ordering',
      steps: [
        { src: '/wingstop/mobileapp/m-flavors.webp', label: 'Flavor selection' },
        { src: '/wingstop/usability/step-1b-quantities.webp', label: 'Flavor quantities' },
        { src: '/wingstop/mobileapp/m-customize.webp', label: 'Side customization' },
        { src: '/wingstop/usability/step-3-drink.webp', label: 'Drink selection' },
        { src: '/wingstop/usability/step-4-upgrade.webp', label: 'Upgrade' },
      ],
    },
    {
      name: 'Single-page ordering',
      steps: [
        { src: '/wingstop/usability/step-1-flavors.webp', label: 'Choose flavors' },
        { src: '/wingstop/usability/step-2-side.webp', label: 'Choose a side' },
        { src: '/wingstop/usability/step-3-drink.webp', label: 'Choose a drink' },
        { src: '/wingstop/mobileapp/m-done.webp', label: 'Review order' },
      ],
    },
    {
      name: 'Desktop ordering',
      steps: [
        { src: '/wingstop/desktopapp/d-flavors.webp', label: 'Menu' },
        { src: '/wingstop/desktopapp/d-flavor-custom.webp', label: 'Customize' },
        { src: '/wingstop/desktopapp/d-drink.webp', label: 'Drink' },
        { src: '/wingstop/desktopapp/d-side.webp', label: 'Upgrade' },
      ],
    },
    {
      name: 'Side upgrade',
      steps: [
        { src: '/wingstop/usability/step-2-side.webp', label: 'Side selection' },
        { src: '/wingstop/usability/step-4-upgrade.webp', label: 'Upgrade side' },
        { src: '/wingstop/mobileapp/m-done.webp', label: 'Applied' },
      ],
    },
  ],
  darkMode: {
    eyebrow: 'DARK MODE',
    title: 'The whole app, after dark',
    body: 'A full dark theme so the food photography only got richer. Every screen, re-themed.',
    screens: [
      '/wingstop/darkmode/dm-1.webp',
      '/wingstop/darkmode/dm-2.webp',
      '/wingstop/darkmode/dm-3.webp',
      '/wingstop/darkmode/dm-4.webp',
      '/wingstop/darkmode/dm-checkout.webp',
    ],
  },
  improvement: {
    eyebrow: 'UI IMPROVEMENT',
    title: 'A complicated order, made simple',
    body: 'A measured usability overhaul of the build-your-meal flow. Here it is in motion.',
    screens: [
      '/wingstop/usability/step-1-flavors.webp',
      '/wingstop/usability/step-2-side.webp',
      '/wingstop/usability/step-4-upgrade.webp',
    ],
    video: '/wingstop/video/ux-walkthrough.mp4',
    poster: '/wingstop/usability/step-1-flavors.webp',
  },
}

/** SECTION 2 — The full app, across platforms (foundational, built first). */
export const appFoundation = {
  eyebrow: 'THE FOUNDATION',
  heading: 'THE FULL APP, ACROSS PLATFORMS',
  intro: 'Before the flavor work, the foundation: I pitched and designed the entire ordering app, product pages, customization, cart, and checkout, across mobile and desktop, then led the team that built it out screen by screen.',
  /** Tall product/cart/checkout screens for the perspective stage. */
  screens: [
    { src: '/wingstop/product/m-product-1.webp', alt: 'Wing combo product page' },
    { src: '/wingstop/product/m-product-2.webp', alt: 'Upgraded sides' },
    { src: '/wingstop/product/m-product-3.webp', alt: 'Special requests' },
    { src: '/wingstop/product/m-product-4.webp', alt: 'Product detail' },
    { src: '/wingstop/product/m-cart.webp', alt: 'Cart' },
    { src: '/wingstop/product/m-checkout.webp', alt: 'Checkout' },
  ],
  caption: 'Product, customization, cart and checkout, designed mobile-first, then scaled to desktop.',
}

export const challenge = {
  heading: 'THE CHALLENGE',
  intro: 'Ordering wings is a group decision with too many variables. Flavors, counts, combos, crew size, and a menu that changes store to store. The old experience made guests do all of that work. The redesign had to make a complicated order feel like a crave.',
  problems: [
    {
      tag: '01',
      icon: 'menu',
      title: 'A menu that outgrew its UI',
      body: 'Eleven flavors across heat levels, plus bundles, tenders, sides, and dips. Choice overload buried the thing Wingstop sells best, flavor, under taxonomy.',
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
    beforeLabel: '2019, the old menu',
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
    body: 'A single slider sets the tone, from no-heat sweet to blazing-hot Atomic, and filters the whole menu to match the mood. Drag it.',
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
  intro: 'The biggest UX project: rebuilding the build-your-meal flow. A 15-piece meal for two used to mean a dozen decisions. We turned it into a guided sequence, pick flavors, set quantities, choose sides and drinks, upgrade, that feels like a crave, not a form.',
  /** The Wing Calculator™ hunger scale (reskinned FeelingSlider). */
  calculator: {
    eyebrow: 'WING CALCULATOR™',
    title: 'Math nobody should do hungry',
    body: 'Rate your hunger, snacky, hungry, or starving, and the Wing Calculator™ sizes the order to your crew. Group-order friction, engineered away. Try the scale.',
  },
  /** Step screens for the horizontal walkthrough. */
  steps: [
    { src: '/wingstop/usability/step-1-flavors.webp', title: 'Choose flavors', body: 'Browse by flavor and heat, not a dropdown.' },
    { src: '/wingstop/usability/step-1b-quantities.webp', title: 'Specify quantities', body: 'Split the count across flavors with a slider per flavor.' },
    { src: '/wingstop/usability/step-2-side.webp', title: 'Choose a side', body: 'Fries, corn, veggies, shown, not listed.' },
    { src: '/wingstop/usability/step-3-drink.webp', title: 'Choose a drink', body: 'Brand logos make the pick instant.' },
    { src: '/wingstop/usability/step-4-upgrade.webp', title: 'Upgrade a side', body: 'One tap to make it a meal.' },
    { src: '/wingstop/usability/step-5-review.webp', title: 'Review & order', body: 'Every step visible, nothing buried.' },
  ],
}

/** SECTION 6 — Range of craft: Dark Mode + In-Store + CRM. */
export const craft = {
  eyebrow: 'RANGE OF CRAFT',
  heading: 'ONE SYSTEM, MANY SURFACES',
  intro: 'The flavor-first system reached further than the order screen. A sleek dark mode, physical menu boards in restaurants, and a modular email engine that powered campaign after campaign.',
  darkMode: {
    eyebrow: 'DARK MODE',
    title: 'The whole app, after dark',
    body: 'A full dark theme, personalized home, reorder, menu, configurator, and checkout, designed so the food photography only got richer.',
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
    body: 'Vertical and horizontal digital menu boards, combos, group packs, extras, drinks, implemented in restaurants.',
    boards: [
      { src: '/wingstop/instore/board-1.webp', alt: 'In-store menu board 1' },
      { src: '/wingstop/instore/board-2.webp', alt: 'In-store menu board 2' },
    ],
  },
  crm: {
    eyebrow: 'MODULAR CRM',
    title: 'One email system, every campaign',
    body: 'A modular email design, 25 Days of Flavor, game-day promos, delivery, onboarding, assembled from shared blocks so the team could ship campaigns fast and on-brand.',
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
  intro: 'Beyond the core experience, the team and I shipped the supporting surfaces too. Store-finder pages that helped guests find a location, and more.',
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
  intro: 'The app shipped in 2019. A year later, COVID closed every dining room, and the year-old ordering experience became the entire business overnight.',
  beats: [
    {
      eyebrow: 'SHIPPED 2019',
      title: 'A year early, by luck',
      body: 'The flavor-first app launched a full year before anyone knew dining rooms would close. Digital was already the strategy.',
    },
    {
      eyebrow: 'MARCH 2020',
      title: 'Dining rooms close',
      body: 'Overnight, every order had to go through digital. The app wasn’t a convenience anymore. It was the storefront.',
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
      description: 'Across 1.4 million+ ratings on iOS, among the highest-rated ordering apps in the category.',
    },
    {
      value: 63.7,
      decimals: 1,
      suffix: '%',
      label: 'COVID Digital Surge',
      description: 'Digital share of sales in Q2 2020, double the 30% mix from when the app launched a year earlier.',
    },
    {
      value: 70.3,
      decimals: 1,
      suffix: '%',
      label: 'Digital Sales Mix',
      description: 'Share of systemwide sales flowing through digital by Q4 2024, still climbing, at 72.8% by late 2025.',
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
