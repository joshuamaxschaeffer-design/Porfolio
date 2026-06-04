import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'headline', type: 'text', required: true },
    { name: 'subhead', type: 'textarea' },
    {
      name: 'background',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'Process Animation (custom React)', value: 'animation' },
      ],
    },
    {
      name: 'backgroundMedia',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, sibling) =>
          sibling?.background === 'image' || sibling?.background === 'video',
      },
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}
