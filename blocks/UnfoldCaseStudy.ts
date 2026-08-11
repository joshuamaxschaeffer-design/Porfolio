import type { Block } from 'payload'

/**
 * Unfold case study — a single composed block, same pattern as
 * `wingstopCaseStudy`: content defaults live in
 * `components/blocks/unfold/data.ts`; the optional fields below allow copy
 * overrides from the CMS without touching code.
 */
export const UnfoldCaseStudy: Block = {
  slug: 'unfoldCaseStudy',
  labels: { singular: 'Unfold Case Study', plural: 'Unfold Case Studies' },
  fields: [
    {
      type: 'collapsible',
      label: 'Overview',
      admin: { initCollapsed: true },
      fields: [
        { name: 'dateRange', type: 'text', admin: { description: 'e.g. "Apr – Aug 2026"' } },
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
        { name: 'contextIntro', type: 'textarea' },
        { name: 'outcomesIntro', type: 'textarea' },
      ],
    },
  ],
}
