import type { Block } from 'payload'

export const LifecycleSection: Block = {
  slug: 'lifecycleSection',
  labels: { singular: 'Lifecycle Section', plural: 'Lifecycle Sections' },
  fields: [
    {
      name: 'phase',
      type: 'select',
      required: true,
      options: [
        { label: 'Strategy & Discovery', value: 'strategy' },
        { label: 'Brand Systems & Identity', value: 'brand' },
        { label: 'Product & UX Design', value: 'product' },
        { label: 'Systems & Implementation', value: 'systems' },
        { label: 'Launch & Growth', value: 'launch' },
      ],
    },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'logos',
      type: 'relationship',
      relationTo: 'logos',
      hasMany: true,
      admin: { description: 'Logos to show under this lifecycle phase.' },
    },
    {
      name: 'artifacts',
      type: 'array',
      labels: { singular: 'Artifact', plural: 'Artifacts' },
      admin: {
        description:
          'Optional small visual artifacts (flow snippets, brand bits, motion stills).',
      },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
  ],
}
