import type { Block } from 'payload'

/**
 * Baserate case study — a single composed block.
 *
 * The Baserate page is a bespoke, highly interactive layout (draggable challenge
 * carousel, the exploration image stack, staggered auto-scroll video carousels).
 * Rather than splitting it into a dozen tiny editable blocks, it ships as one
 * block whose content defaults live in `components/blocks/baserate/data.ts`.
 *
 * The optional fields below let the copy be overridden from the CMS without
 * touching code; when left blank, the component falls back to the Figma-sourced
 * defaults. Media (problem images, exploration images, product screenshots,
 * demo videos) is served from `/public/baserate/**` and referenced by the data
 * module, so editors don't need to re-upload it to change wording.
 */
export const BaserateCaseStudy: Block = {
  slug: 'baserateCaseStudy',
  labels: { singular: 'Baserate Case Study', plural: 'Baserate Case Studies' },
  fields: [
    {
      type: 'collapsible',
      label: 'Overview',
      admin: { initCollapsed: true },
      fields: [
        { name: 'dateRange', type: 'text', admin: { description: 'e.g. "April 20, 2022 — April 19 2026"' } },
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
      label: 'The Challenge (intro only — cards are code-managed)',
      admin: { initCollapsed: true },
      fields: [
        { name: 'challengeHeading', type: 'text' },
        { name: 'challengeIntro', type: 'textarea' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Section headings & intros',
      admin: { initCollapsed: true },
      fields: [
        { name: 'architectureIntro', type: 'textarea' },
        { name: 'productSystemIntro', type: 'textarea' },
      ],
    },
  ],
}
