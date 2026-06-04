import type { Block } from 'payload'

export const LogoWall: Block = {
  slug: 'logoWall',
  labels: { singular: 'Logo Wall', plural: 'Logo Walls' },
  fields: [
    {
      name: 'logos',
      type: 'relationship',
      relationTo: 'logos',
      hasMany: true,
      required: true,
      admin: { description: 'Pick logos from the Logos collection.' },
    },
    {
      name: 'maxCount',
      type: 'number',
      defaultValue: 8,
      admin: { description: 'Max number to show (logos beyond this are hidden).' },
    },
    {
      name: 'randomize',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Shuffle logo order on each page load.' },
    },
  ],
}
