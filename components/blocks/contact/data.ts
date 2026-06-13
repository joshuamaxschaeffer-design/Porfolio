/**
 * Contact page — content + form option lists.
 *
 * The option arrays are the single source of truth for the dropdowns. The API
 * route (app/api/contact/route.ts) keeps a matching copy and validates against
 * it server-side, so submissions can only carry values the UI actually offered.
 * Keep the two in sync if you edit these.
 *
 * Copy follows Portfolio-Strategy.md §9.6 (contact form with scope fields so
 * unqualified inbound self-selects out) and §10.2 (declarative, operator tone).
 * The fields are designed to "helpfully frame the request" (per Joshua): a
 * visitor picks what they need, the budget, and the timeline, so the inquiry
 * arrives already qualified.
 */

export const intro = {
  eyebrow: 'Contact',
  heading: 'Let’s talk about\nthe work.',
  lead:
    'Tell me what you’re building and how I can help. The more you can frame the scope, budget, and timing, the faster I can come back with something useful.',
}

/** What the engagement is. Mirror of PROJECT_TYPES in the API route. */
export const projectTypes = [
  'Product / app design',
  'Brand identity & systems',
  'Product + brand (full engagement)',
  'Design systems & implementation',
  'Fractional / interim design lead',
  'Marketing site or landing page',
  'Something else',
]

/** Budget band. Mirror of BUDGETS in the API route. */
export const budgets = [
  'Under $10k',
  '$10k–$25k',
  '$25k–$50k',
  '$50k–$100k',
  '$100k+',
  'Not sure yet',
]

/** Timing. Mirror of TIMELINES in the API route. */
export const timelines = [
  'As soon as possible',
  'In the next month',
  '1–3 months out',
  'Just exploring',
]

/** Direct-contact rail beside the form — for buyers who'd rather not fill it. */
export const directContact = {
  heading: 'Prefer something direct?',
  email: 'joshuamaxschaeffer@gmail.com',
  /** strategy §9.6 — Cal.com link for a 20-min intro; wire the real URL later */
  callLabel: 'Book a 20-min intro',
  callHref: 'https://cal.com/joshuaschaeffer',
  linkedinLabel: 'LinkedIn',
  linkedinHref: 'https://www.linkedin.com/in/josh-schaeffer-88973868/',
  location: 'San Luis Obispo, CA · works remote',
}

/** Reassurance line under the submit button. */
export const formNote =
  'I read every message myself and reply within a couple of business days.'
