import type { Block } from 'payload'

export const LottieBlock: Block = {
  slug: 'lottie',
  labels: { singular: 'Lottie / Vector Animation', plural: 'Lottie Animations' },
  fields: [
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Upload a .lottie or .json animation file (e.g. exported from LottieFiles).',
      },
    },
    {
      name: 'loop',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'playOnHover',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Only play while the cursor is hovering. Overrides autoplay.',
      },
    },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'wide',
      options: [
        { label: 'Narrow (max 480px)', value: 'narrow' },
        { label: 'Wide (max 800px)', value: 'wide' },
        { label: 'Full bleed', value: 'full' },
      ],
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}
