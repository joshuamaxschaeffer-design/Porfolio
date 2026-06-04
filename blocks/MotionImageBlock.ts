import type { Block } from 'payload'

export const MotionImageBlock: Block = {
  slug: 'motionImage',
  labels: { singular: 'Motion Image', plural: 'Motion Images' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'alt', type: 'text' },
    {
      type: 'collapsible',
      label: 'Transform',
      fields: [
        { name: 'skewX', type: 'number', defaultValue: 0, admin: { description: 'Degrees of horizontal skew (e.g. -6).' } },
        { name: 'skewY', type: 'number', defaultValue: 0 },
        { name: 'rotate', type: 'number', defaultValue: 0 },
        {
          name: 'rounded',
          type: 'select',
          defaultValue: 'md',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
            { label: 'Extra large', value: 'xl' },
            { label: 'Full (circle)', value: 'full' },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Shadow',
      fields: [
        {
          name: 'shadow',
          type: 'select',
          defaultValue: 'soft',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Soft (subtle box shadow)', value: 'soft' },
            { label: 'Dramatic (deep box shadow)', value: 'dramatic' },
            { label: 'Colored (custom box shadow)', value: 'colored' },
            { label: 'Drop (follows PNG transparency)', value: 'drop-png' },
          ],
        },
        {
          name: 'shadowColor',
          type: 'text',
          defaultValue: '#000000',
          admin: {
            description: 'Hex color, used for "colored" and "drop-png" shadows.',
            condition: (_, sib) => sib?.shadow === 'colored' || sib?.shadow === 'drop-png',
          },
        },
        {
          name: 'shadowBlur',
          type: 'number',
          defaultValue: 30,
          admin: {
            condition: (_, sib) => sib?.shadow === 'colored' || sib?.shadow === 'drop-png',
          },
        },
        {
          name: 'shadowOffsetX',
          type: 'number',
          defaultValue: 0,
          admin: {
            condition: (_, sib) => sib?.shadow === 'colored' || sib?.shadow === 'drop-png',
          },
        },
        {
          name: 'shadowOffsetY',
          type: 'number',
          defaultValue: 12,
          admin: {
            condition: (_, sib) => sib?.shadow === 'colored' || sib?.shadow === 'drop-png',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Mask (clip to another image)',
      fields: [
        {
          name: 'maskImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Optional. Use a transparent PNG to clip this image (and its shadow) to that silhouette.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Hover',
      fields: [
        {
          name: 'hover',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Lift on hover', value: 'lift' },
            { label: '3D tilt (cursor follow)', value: 'tilt-3d' },
            { label: 'Parallax skew', value: 'parallax-skew' },
          ],
        },
        {
          name: 'tiltMax',
          type: 'number',
          defaultValue: 12,
          admin: {
            description: 'Max tilt angle in degrees.',
            condition: (_, sib) => sib?.hover === 'tilt-3d',
          },
        },
      ],
    },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'wide',
      options: [
        { label: 'Narrow', value: 'narrow' },
        { label: 'Wide', value: 'wide' },
        { label: 'Full bleed', value: 'full' },
      ],
    },
    { name: 'caption', type: 'text' },
  ],
}
