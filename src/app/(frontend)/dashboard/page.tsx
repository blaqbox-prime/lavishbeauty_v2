import { getPayload } from 'payload'
import config from '@payload-config'
import { getRevenue, getProfit, getTopClients, getTopServices, getBookingCounts } from '@/lib/analytics'

export default async function DashboardPage() {
  const payload = await getPayload({ config })
  const [revenue, profit, topClients, topServices, counts] = await Promise.all([
    getRevenue(payload),
    getProfit(payload),
    getTopClients(payload),
    getTopServices(payload),
    getBookingCounts(payload),
  ])
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="rounded border p-4"><div className="text-sm text-neutral-500">Revenue</div><div className="text-2xl font-bold">${revenue}</div></div>
        <div className="rounded border p-4"><div className="text-sm text-neutral-500">Profit</div><div className="text-2xl font-bold">${profit.profit}</div></div>
        <div className="rounded border p-4"><div className="text-sm text-neutral-500">Bookings</div><div className="text-2xl font-bold">{counts.total}</div></div>
        <div className="rounded border p-4"><div className="text-sm text-neutral-500">Completed</div><div className="text-2xl font-bold">{counts.completed}</div></div>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded border p-4">
          <h2 className="font-semibold">High-value clients</h2>
          <ul className="mt-2 text-sm">
            {topClients.map((c: any) => <li key={c.id}>{c.name} — ${c.totalSpend || 0}</li>)}
          </ul>
        </div>
        <div className="rounded border p-4">
          <h2 className="font-semibold">High-value services</h2>
          <ul className="mt-2 text-sm">
            {topServices.map((s: any, i: number) => <li key={i}>{s.name} — ${s.revenue} ({s.count})</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}
