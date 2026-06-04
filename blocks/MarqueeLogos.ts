import type { Block } from 'payload'

export const MarqueeLogos: Block = {
  slug: 'marqueeLogos',
  labels: { singular: 'Marquee Logos', plural: 'Marquee Logos' },
  fields: [
    {
      name: 'logos',
      type: 'relationship',
      relationTo: 'logos',
      hasMany: true,
      required: true,
      admin: { description: 'Logos to scroll. They duplicate seamlessly.' },
    },
    {
      name: 'duration',
      type: 'number',
      defaultValue: 40,
      admin: { description: 'Animation duration in seconds. Lower = faster.' },
    },
    {
      name: 'direction',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Scroll left', value: 'left' },
        { label: 'Scroll right', value: 'right' },
      ],
    },
    {
      name: 'pauseOnHover',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
