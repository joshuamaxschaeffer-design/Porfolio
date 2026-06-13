import type { Block } from 'payload'

/**
 * Capabilities page — a single composed block, same pattern as the case-study
 * blocks (`pandaCaseStudy` etc.): all content defaults live in
 * `components/blocks/capabilities/data.ts`; the optional fields below allow copy
 * overrides from the CMS without touching code.
 *
 * NOTE: distinct slug `capabilitiesPage` to avoid colliding with the legacy
 * inline `capabilities` block (the one-line dot list used elsewhere).
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
        { name: 'eyebrow', type: 'text', admin: { description: 'Small label above the title' } },
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
      label: 'Disciplines (optional override)',
      admin: {
        initCollapsed: true,
        description:
          'Leave empty to use the built-in discipline list. Adding rows here replaces it entirely.',
      },
      fields: [
        {
          name: 'categories',
          type: 'array',
          labels: { singular: 'Discipline', plural: 'Disciplines' },
          fields: [
            { name: 'num', type: 'text', required: true, admin: { description: 'e.g. "01"' } },
            { name: 'title', type: 'text', required: true },
            { name: 'blurb', type: 'textarea', required: true },
            {
              name: 'clients',
              type: 'array',
              labels: { singular: 'Client', plural: 'Clients' },
              fields: [{ name: 'name', type: 'text', required: true }],
            },
          ],
        },
      ],
    },
  ],
}
