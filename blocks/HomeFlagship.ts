import type { Block } from 'payload'

/** Shared optional copy-override fields for a home flagship showpiece. */
const flagshipFields: Block['fields'] = [
  { name: 'kicker', type: 'text', admin: { description: 'e.g. "01 — Investor Systems". Blank = default.' } },
  { name: 'title', type: 'text' },
  { name: 'oneLine', type: 'textarea' },
  { name: 'meta', type: 'text', admin: { description: 'Role · dates line.' } },
  { name: 'href', type: 'text', admin: { description: 'Case study link, e.g. /work/baserate' } },
]

/**
 * Home flagship #1 — Baserate. Full-bleed scroll-in showpiece, rendered first
 * with the most flourish. All copy defaults live in
 * components/blocks/home/data.ts; these fields override without code edits.
 */
export const HomeFlagshipBaserate: Block = {
  slug: 'homeFlagshipBaserate',
  labels: { singular: 'Home Flagship — Baserate', plural: 'Home Flagship — Baserate' },
  fields: flagshipFields,
}

/** Home flagship #2 — Panda Express. Sibling showpiece, warmer accent. */
export const HomeFlagshipPanda: Block = {
  slug: 'homeFlagshipPanda',
  labels: { singular: 'Home Flagship — Panda', plural: 'Home Flagship — Panda' },
  fields: flagshipFields,
}
