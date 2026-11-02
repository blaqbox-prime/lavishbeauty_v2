import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'quote', type: 'textarea', required: true },
    { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    { name: 'featured', type: 'checkbox', defaultValue: false },
  ],
}
