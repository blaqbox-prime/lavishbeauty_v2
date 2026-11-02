import type { CollectionConfig } from 'payload'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['customer', 'service', 'date', 'status', 'paymentStatus'],
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      required: true,
    },
    { name: 'date', type: 'date', required: true },
    { name: 'startTime', type: 'text', required: true },
    { name: 'endTime', type: 'text', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'No-show', value: 'no-show' },
      ],
    },
    { name: 'price', type: 'number', required: true },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'unpaid',
      options: [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Deposit paid', value: 'deposit' },
        { label: 'Paid', value: 'paid' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    { name: 'depositPaid', type: 'number', defaultValue: 0 },
    { name: 'stripePaymentIntentId', type: 'text' },
    { name: 'notes', type: 'textarea' },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          try {
            const customer = await req.payload.findByID({ collection: 'customers', id: doc.customer })
            const service = await req.payload.findByID({ collection: 'services', id: doc.service })
            await req.payload.create({
              collection: 'invoices',
              data: {
                booking: doc.id,
                customer: doc.customer,
                lineItems: [
                  {
                    description: service.name,
                    quantity: 1,
                    unitPrice: doc.price,
                    total: doc.price,
                  },
                ],
                subtotal: doc.price,
                tax: 0,
                total: doc.price,
                status: 'sent',
              },
            })
            // send confirmation email (best-effort)
            try {
              const { sendBookingConfirmation } = await import('../lib/email')
              await sendBookingConfirmation({
                to: customer.email,
                customerName: customer.name,
                serviceName: service.name,
                date: doc.date,
                startTime: doc.startTime,
              })
            } catch (e) {
              req.payload.logger.error({ err: e, msg: 'email send failed' })
            }
          } catch (e) {
            req.payload.logger.error({ err: e, msg: 'booking afterChange failed' })
          }
        }
        if (operation === 'update' && doc.status === 'completed') {
          try {
            const customer = await req.payload.findByID({ collection: 'customers', id: doc.customer })
            const newSpend = (customer.totalSpend || 0) + (doc.price || 0)
            await req.payload.update({
              collection: 'customers',
              id: doc.customer,
              data: { totalSpend: newSpend },
            })
          } catch (e) {
            req.payload.logger.error({ err: e, msg: 'totalSpend update failed' })
          }
        }
      },
    ],
  },
}
