import type { CollectionConfig } from 'payload'
import { revalidateGlobalHook } from '../hooks/revalidate'

export const Navigation: CollectionConfig = {
  slug: 'navigation',
  labels: {
    singular: 'Navigation (per brand)',
    plural: 'Navigation',
  },
  hooks: { afterChange: [revalidateGlobalHook] },
  admin: {
    useAsTitle: 'brand',
    description: 'Top-level nav. One entry per brand.',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'brand',
      type: 'select',
      required: true,
      unique: true,
      options: [
        { label: 'Personal (schaeffer.design)', value: 'personal' },
        { label: 'Practice (schaefferpractice.com)', value: 'practice' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Nav item', plural: 'Nav items' },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'page',
          options: [
            { label: 'Link to a Page', value: 'page' },
            { label: 'External URL', value: 'external' },
          ],
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'page',
          },
        },
        {
          name: 'externalUrl',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'external',
          },
        },
      ],
    },
  ],
}
