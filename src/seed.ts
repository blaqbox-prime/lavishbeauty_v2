import { getPayload } from 'payload'
import config from '@payload-config'

async function seed() {
  const payload = await getPayload({ config })

  const cat = await payload.create({ collection: 'categories', data: { name: 'Hair', slug: 'hair' } })
  const cat2 = await payload.create({ collection: 'categories', data: { name: 'Nails', slug: 'nails' } })
  const cat3 = await payload.create({ collection: 'categories', data: { name: 'Makeup', slug: 'makeup' } })

  const svc = await payload.create({ collection: 'services', data: { name: 'Haircut', slug: 'haircut', price: 45, cost: 10, duration: 45, category: cat.id, active: true, featured: true } })
  await payload.create({ collection: 'services', data: { name: 'Manicure', slug: 'manicure', price: 30, cost: 8, duration: 30, category: cat2.id, active: true } })
  await payload.create({ collection: 'services', data: { name: 'Bridal Makeup', slug: 'bridal-makeup', price: 120, cost: 25, duration: 90, category: cat3.id, active: true, featured: true } })

  const customer = await payload.create({ collection: 'customers', data: { name: 'Jane Doe', email: 'jane@example.com', phone: '555-0100' } })

  await payload.create({
    collection: 'bookings',
    data: { customer: customer.id, service: svc.id, date: new Date().toISOString(), startTime: '10:00', endTime: '10:45', price: 45, status: 'completed', paymentStatus: 'paid' },
  })

  console.log('Seed complete')
  process.exit(0)
}

seed().catch((e) => { console.error(e); process.exit(1) })
