import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'totalSpend'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'phone', type: 'text' },
    { name: 'notes', type: 'textarea' },
    { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
    { name: 'stripeCustomerId', type: 'text' },
    { name: 'totalSpend', type: 'number', defaultValue: 0, admin: { readOnly: true } },
  ],
}
