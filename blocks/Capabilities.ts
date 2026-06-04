import type { Block } from 'payload'

export const Capabilities: Block = {
  slug: 'capabilities',
  labels: { singular: 'Capabilities', plural: 'Capabilities' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Capability', plural: 'Capabilities' },
      required: true,
      minRows: 2,
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'inline',
      options: [
        { label: 'Inline (one line, dots separated)', value: 'inline' },
        { label: 'Pills', value: 'pills' },
        { label: 'Grid', value: 'grid' },
      ],
    },
  ],
}
