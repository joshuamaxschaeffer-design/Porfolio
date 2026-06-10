import type { Block } from 'payload'

/**
 * Panda Express case study — a single composed block, same pattern as
 * `baserateCaseStudy`: content defaults live in
 * `components/blocks/panda/data.ts`; the optional fields below allow copy
 * overrides from the CMS without touching code.
 */
export const PandaCaseStudy: Block = {
  slug: 'pandaCaseStudy',
  labels: { singular: 'Panda Express Case Study', plural: 'Panda Express Case Studies' },
  fields: [
    {
      type: 'collapsible',
      label: 'Overview',
      admin: { initCollapsed: true },
      fields: [
        { name: 'dateRange', type: 'text', admin: { description: 'e.g. "2020 — 2022"' } },
        { name: 'lead', type: 'textarea' },
        { name: 'role', type: 'text' },
        {
          name: 'scope',
          type: 'array',
          labels: { singular: 'Scope item', plural: 'Scope items' },
          fields: [{ name: 'label', type: 'text', required: true }],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Section intros',
      admin: { initCollapsed: true },
      fields: [
        { name: 'challengeIntro', type: 'textarea' },
        { name: 'releasesIntro', type: 'textarea' },
        { name: 'outcomesIntro', type: 'textarea' },
      ],
    },
  ],
}
