import type { CollectionConfig } from 'payload'

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['customer', 'total', 'status', 'issuedAt'],
  },
  fields: [
    {
      name: 'booking',
      type: 'relationship',
      relationTo: 'bookings',
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
    },
    {
      name: 'lineItems',
      type: 'array',
      required: true,
      fields: [
        { name: 'description', type: 'text', required: true },
        { name: 'quantity', type: 'number', required: true, defaultValue: 1 },
        { name: 'unitPrice', type: 'number', required: true },
        { name: 'total', type: 'number', required: true },
      ],
    },
    { name: 'subtotal', type: 'number', required: true },
    { name: 'tax', type: 'number', defaultValue: 0 },
    { name: 'total', type: 'number', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Sent', value: 'sent' },
        { label: 'Paid', value: 'paid' },
        { label: 'Overdue', value: 'overdue' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    { name: 'stripeInvoiceId', type: 'text' },
    { name: 'issuedAt', type: 'date', defaultValue: () => new Date().toISOString() },
    { name: 'dueAt', type: 'date' },
  ],
}
