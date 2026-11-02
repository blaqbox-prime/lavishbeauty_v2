import type { Payload } from 'payload'

export function generateSlots(open: string, close: string, interval: number, duration: number) {
  const slots: string[] = []
  const [oh, om] = open.split(':').map(Number)
  const [ch, cm] = close.split(':').map(Number)
  let cur = oh * 60 + om
  const end = ch * 60 + cm
  while (cur + duration <= end) {
    const h = Math.floor(cur / 60).toString().padStart(2, '0')
    const m = (cur % 60).toString().padStart(2, '0')
    slots.push(`${h}:${m}`)
    cur += interval
  }
  return slots
}

export async function getAvailableSlots(payload: Payload, serviceId: string, date: string) {
  const service = await payload.findByID({ collection: 'services', id: serviceId })
  const settings = await payload.findGlobal({ slug: 'settings' })
  const hours = (settings.businessHours || []).find((h: any) => h.day === new Date(date).toLocaleDateString('en-US', { weekday: 'long' }))
  if (!hours || hours.closed) return []
  const interval = settings.slotInterval || 30
  const slots = generateSlots(hours.open, hours.close, interval, service.duration)
  const existing = await payload.find({
    collection: 'bookings',
    where: { date: { equals: date } },
    limit: 1000,
  })
  const booked = new Set(existing.docs.map((b: any) => b.startTime))
  return slots.filter((s) => !booked.has(s))
}
