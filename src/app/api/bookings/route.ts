import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { addMinutes, parse, format } from 'date-fns'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { serviceId, date, startTime, name, email, phone } = body
    const payload = await getPayload({ config })

    const service = await payload.findByID({ collection: 'services', id: serviceId })
    if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 })

    // find or create customer
    let customers = await payload.find({ collection: 'customers', where: { email: { equals: email } }, limit: 1 })
    let customer = customers.docs[0]
    if (!customer) {
      customer = await payload.create({ collection: 'customers', data: { name, email, phone } })
    }

    // compute endTime
    const start = parse(startTime, 'HH:mm', new Date())
    const end = addMinutes(start, service.duration)
    const endTime = format(end, 'HH:mm')

    const booking = await payload.create({
      collection: 'bookings',
      data: {
        customer: customer.id,
        service: service.id,
        date: new Date(date).toISOString(),
        startTime,
        endTime,
        price: service.price,
        status: 'pending',
        paymentStatus: 'unpaid',
      },
    })

    return NextResponse.json({ id: booking.id })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 })
  }
}
