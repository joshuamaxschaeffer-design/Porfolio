import type { Block } from 'payload'

/**
 * Wingstop case study — a single composed block, same pattern as
 * `pandaCaseStudy`: content defaults live in
 * `components/blocks/wingstop/data.ts`; the optional fields below allow copy
 * overrides from the CMS without touching code.
 */
export const WingstopCaseStudy: Block = {
  slug: 'wingstopCaseStudy',
  labels: { singular: 'Wingstop Case Study', plural: 'Wingstop Case Studies' },
  fields: [
    {
      type: 'collapsible',
      label: 'Overview',
      admin: { initCollapsed: true },
      fields: [
        { name: 'dateRange', type: 'text', admin: { description: 'e.g. "2019 — 2022"' } },
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
        { name: 'redesignIntro', type: 'textarea' },
        { name: 'outcomesIntro', type: 'textarea' },
      ],
    },
  ],
}
