import type { Block } from 'payload'

/**
 * Home secondary row — the lower three (Wingstop · Samsung · Capabilities).
 * Compact 3-up cards beneath the flagship showpieces. Copy defaults live in
 * components/blocks/home/data.ts; the array below overrides per-card if set.
 */
export const HomeSecondaryRow: Block = {
  slug: 'homeSecondaryRow',
  labels: { singular: 'Home Secondary Row', plural: 'Home Secondary Rows' },
  fields: [
    { name: 'heading', type: 'text', admin: { description: 'Optional. Default "More work".' } },
    {
      name: 'items',
      type: 'array',
      maxRows: 3,
      labels: { singular: 'Card', plural: 'Cards' },
      admin: { description: 'Leave empty to use the default Wingstop / Samsung / Capabilities cards.' },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'blurb', type: 'text' },
        { name: 'meta', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
  ],
}
