import type { Block } from 'payload'

/**
 * Unfold case study, a single composed block. All content lives in
 * `components/blocks/unfold/data.ts`; the CMS carries one optional override.
 */
export const UnfoldCaseStudy: Block = {
  slug: 'unfoldCaseStudy',
  labels: { singular: 'Unfold Case Study', plural: 'Unfold Case Studies' },
  fields: [
    {
      name: 'lead',
      type: 'textarea',
      admin: { description: 'Optional override for the hero one-liner.' },
    },
  ],
}
