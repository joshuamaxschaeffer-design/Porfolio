import type { Block } from 'payload'

/**
 * Capabilities — a single composed, case-study-style block (same pattern as
 * `pandaCaseStudy` etc.): all content defaults live in
 * `components/blocks/capabilities/data.ts`; the optional fields below allow copy
 * overrides from the CMS without touching code.
 *
 * Distinct slug `capabilitiesPage` to avoid colliding with the legacy inline
 * `capabilities` block (the one-line dot list). Lives on a case-study doc so it
 * renders at /work/capabilities; registered as a full-bleed block.
 */
export const CapabilitiesPage: Block = {
  slug: 'capabilitiesPage',
  labels: { singular: 'Capabilities Page', plural: 'Capabilities Pages' },
  fields: [
    {
      type: 'collapsible',
      label: 'Header',
      admin: { initCollapsed: true },
      fields: [
        { name: 'eyebrow', type: 'text' },
        {
          name: 'heading',
          type: 'textarea',
          admin: { description: 'Page title. Line breaks are preserved.' },
        },
        { name: 'lead', type: 'textarea' },
        { name: 'note', type: 'text', admin: { description: 'Small print under the lead' } },
      ],
    },
    {
      type: 'collapsible',
      label: 'Discipline sections (optional override)',
      admin: {
        initCollapsed: true,
        description:
          'Leave empty to use the built-in sections + FPO placeholders. Adding rows here replaces them entirely.',
      },
      fields: [
        {
          name: 'sections',
          type: 'array',
          labels: { singular: 'Section', plural: 'Sections' },
          fields: [
            { name: 'id', type: 'text', required: true, admin: { description: 'Anchor id, e.g. "brand"' } },
            { name: 'num', type: 'text', required: true, admin: { description: 'e.g. "03"' } },
            { name: 'title', type: 'text', required: true },
            { name: 'intro', type: 'textarea', required: true },
            {
              name: 'layout',
              type: 'select',
              defaultValue: 'mediaRight',
              options: [
                { label: 'Media right', value: 'mediaRight' },
                { label: 'Media left', value: 'mediaLeft' },
                { label: 'Copy then media row', value: 'stack' },
                { label: 'Copy then 3 frames', value: 'trio' },
              ],
            },
            {
              name: 'clients',
              type: 'array',
              labels: { singular: 'Client', plural: 'Clients' },
              fields: [{ name: 'name', type: 'text', required: true }],
            },
            {
              name: 'media',
              type: 'array',
              labels: { singular: 'Media slot', plural: 'Media slots' },
              fields: [
                { name: 'label', type: 'text', required: true },
                {
                  name: 'ratio',
                  type: 'select',
                  defaultValue: 'video',
                  options: ['wide', 'video', 'square', 'portrait', 'tall'].map((r) => ({
                    label: r,
                    value: r,
                  })),
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
