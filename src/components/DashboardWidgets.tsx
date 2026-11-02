'use client'

import { useEffect, useState } from 'react'

export default function DashboardWidgets() {
  const [data, setData] = useState<any>(null)
  useEffect(() => {
    fetch('/api/analytics').then((r) => r.json()).then(setData).catch(() => {})
  }, [])
  if (!data) return <div className="p-4">Loading analytics...</div>
  return (
    <div className="grid gap-4 p-4 md:grid-cols-4">
      <div className="rounded border p-4">
        <div className="text-sm text-neutral-500">Revenue</div>
        <div className="text-2xl font-bold">${data.revenue}</div>
      </div>
      <div className="rounded border p-4">
        <div className="text-sm text-neutral-500">Profit</div>
        <div className="text-2xl font-bold">${data.profit?.profit ?? 0}</div>
      </div>
      <div className="rounded border p-4">
        <div className="text-sm text-neutral-500">Bookings</div>
        <div className="text-2xl font-bold">{data.counts?.total ?? 0}</div>
      </div>
      <div className="rounded border p-4">
        <div className="text-sm text-neutral-500">Completed</div>
        <div className="text-2xl font-bold">{data.counts?.completed ?? 0}</div>
      </div>
      <div className="col-span-full rounded border p-4">
        <div className="font-semibold">Top clients</div>
        <ul className="mt-2 text-sm">
          {(data.topClients || []).map((c: any) => (
            <li key={c.id}>{c.name} — ${c.totalSpend || 0}</li>
          ))}
        </ul>
      </div>
      <div className="col-span-full rounded border p-4">
        <div className="font-semibold">Top services</div>
        <ul className="mt-2 text-sm">
          {(data.topServices || []).map((s: any, i: number) => (
            <li key={i}>{s.name} — ${s.revenue} ({s.count})</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
