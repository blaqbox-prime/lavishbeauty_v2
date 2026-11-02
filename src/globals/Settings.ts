import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Salon Settings',
  fields: [
    { name: 'salonName', type: 'text', required: true, defaultValue: 'Beauty Salon' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'address', type: 'textarea' },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    {
      name: 'businessHours',
      type: 'array',
      fields: [
        { name: 'day', type: 'text', required: true },
        { name: 'open', type: 'text', required: true },
        { name: 'close', type: 'text', required: true },
        { name: 'closed', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'slotInterval', type: 'number', defaultValue: 30, admin: { description: 'Slot length in minutes' } },
    { name: 'currency', type: 'text', defaultValue: 'USD' },
    { name: 'taxRate', type: 'number', defaultValue: 0 },
  ],
}
