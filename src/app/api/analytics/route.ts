import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getRevenue, getProfit, getTopClients, getTopServices, getBookingCounts } from '@/lib/analytics'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const [revenue, profit, topClients, topServices, counts] = await Promise.all([
      getRevenue(payload),
      getProfit(payload),
      getTopClients(payload),
      getTopServices(payload),
      getBookingCounts(payload),
    ])
    return NextResponse.json({ revenue, profit, topClients, topServices, counts })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 })
  }
}
