import type { Payload } from 'payload'

export async function getRevenue(payload: Payload) {
  const invoices = await payload.find({
    collection: 'invoices',
    where: { status: { equals: 'paid' } },
    limit: 1000,
  })
  return invoices.docs.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0)
}

export async function getProfit(payload: Payload) {
  const bookings = await payload.find({
    collection: 'bookings',
    where: { status: { equals: 'completed' } },
    limit: 1000,
    depth: 1,
  })
  let revenue = 0
  let cost = 0
  for (const b of bookings.docs as any[]) {
    revenue += b.price || 0
    const svc = b.service
    const serviceCost = typeof svc === 'object' ? svc?.cost || 0 : 0
    cost += serviceCost
  }
  return { revenue, cost, profit: revenue - cost }
}

export async function getTopClients(payload: Payload, limit = 5) {
  const customers = await payload.find({
    collection: 'customers',
    sort: '-totalSpend',
    limit,
  })
  return customers.docs
}

export async function getTopServices(payload: Payload, limit = 5) {
  const bookings = await payload.find({
    collection: 'bookings',
    where: { status: { in: ['completed', 'confirmed'] } },
    limit: 1000,
    depth: 1,
  })
  const map = new Map<string, { name: string; revenue: number; count: number }>()
  for (const b of bookings.docs as any[]) {
    const svc = b.service
    const name = typeof svc === 'object' ? svc?.name || 'Unknown' : 'Unknown'
    const id = typeof svc === 'object' ? svc?.id : svc
    const cur = map.get(id) || { name, revenue: 0, count: 0 }
    cur.revenue += b.price || 0
    cur.count += 1
    map.set(id, cur)
  }
  return Array.from(map.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}

export async function getBookingCounts(payload: Payload) {
  const all = await payload.find({ collection: 'bookings', limit: 1 })
  const pending = await payload.find({ collection: 'bookings', where: { status: { equals: 'pending' } }, limit: 1 })
  const completed = await payload.find({ collection: 'bookings', where: { status: { equals: 'completed' } }, limit: 1 })
  return { total: all.totalDocs, pending: pending.totalDocs, completed: completed.totalDocs }
}
