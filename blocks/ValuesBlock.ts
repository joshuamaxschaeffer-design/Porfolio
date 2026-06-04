import type { Block } from 'payload'

export const ValuesBlock: Block = {
  slug: 'values',
  labels: { singular: 'Values', plural: 'Values blocks' },
  fields: [
    { name: 'heading', type: 'text', admin: { description: 'Optional section heading.' } },
    {
      name: 'values',
      type: 'array',
      labels: { singular: 'Value', plural: 'Values' },
      required: true,
      minRows: 2,
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
}
