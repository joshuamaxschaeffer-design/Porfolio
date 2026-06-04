import type { Block } from 'payload'

export const Spacer: Block = {
  slug: 'spacer',
  labels: { singular: 'Spacer', plural: 'Spacers' },
  fields: [
    {
      name: 'size',
      type: 'select',
      defaultValue: 'md',
      options: [
        { label: 'Small (24px)', value: 'sm' },
        { label: 'Medium (48px)', value: 'md' },
        { label: 'Large (96px)', value: 'lg' },
        { label: 'Extra large (160px)', value: 'xl' },
      ],
    },
  ],
}
