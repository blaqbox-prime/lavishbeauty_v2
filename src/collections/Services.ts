import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'duration', 'active'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'richText' },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    { name: 'price', type: 'number', required: true, min: 0 },
    { name: 'cost', type: 'number', required: true, min: 0, admin: { description: 'Internal cost for profit calc' } },
    { name: 'duration', type: 'number', required: true, min: 15, admin: { description: 'Duration in minutes' } },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'active', type: 'checkbox', defaultValue: true },
    { name: 'featured', type: 'checkbox', defaultValue: false },
  ],
}
