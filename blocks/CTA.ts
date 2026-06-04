import type { Block } from 'payload'

export const CTA: Block = {
  slug: 'cta',
  labels: { singular: 'CTA', plural: 'CTAs' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    { name: 'ctaLabel', type: 'text', required: true },
    {
      name: 'ctaUrl',
      type: 'text',
      required: true,
      admin: { description: 'Internal path (/contact) or external URL.' },
    },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Center', value: 'center' },
        { label: 'Left', value: 'left' },
      ],
    },
  ],
}
