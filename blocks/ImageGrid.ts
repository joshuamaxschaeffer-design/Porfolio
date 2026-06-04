import type { Block } from 'payload'

export const ImageGrid: Block = {
  slug: 'imageGrid',
  labels: { singular: 'Image Grid', plural: 'Image Grids' },
  fields: [
    {
      name: 'images',
      type: 'array',
      minRows: 2,
      labels: { singular: 'Image', plural: 'Images' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
        { label: '4 columns', value: '4' },
      ],
    },
    {
      name: 'aspectRatio',
      type: 'select',
      defaultValue: 'natural',
      options: [
        { label: 'Natural', value: 'natural' },
        { label: 'Square', value: 'square' },
        { label: '4:3', value: '4-3' },
        { label: '16:9', value: '16-9' },
        { label: '3:4 (portrait)', value: '3-4' },
      ],
    },
  ],
}
