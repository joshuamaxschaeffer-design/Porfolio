import type { Block } from 'payload'

/**
 * Samsung case study — a single composed block, same pattern as
 * `pandaCaseStudy` / `wingstopCaseStudy`: content defaults live in
 * `components/blocks/samsung/data.ts`; the optional fields below allow copy
 * overrides from the CMS without touching code.
 */
export const SamsungCaseStudy: Block = {
  slug: 'samsungCaseStudy',
  labels: { singular: 'Samsung Case Study', plural: 'Samsung Case Studies' },
  fields: [
    {
      type: 'collapsible',
      label: 'Overview',
      admin: { initCollapsed: true },
      fields: [
        { name: 'dateRange', type: 'text', admin: { description: 'e.g. "2013 — 2017"' } },
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
        { name: 'briefIntro', type: 'textarea' },
        { name: 'workIntro', type: 'textarea' },
        { name: 'outcomesIntro', type: 'textarea' },
      ],
    },
  ],
}
