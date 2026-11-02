import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json()
    const payload = await getPayload({ config })
    const booking = await payload.findByID({ collection: 'bookings', id: bookingId, depth: 2 })
    const service = booking.service as any
    const customer = booking.customer as any

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: service.name },
            unit_amount: Math.round(booking.price * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: customer.email,
      metadata: { bookingId: String(booking.id) },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/book/confirmation/${booking.id}?paid=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/book`,
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 })
  }
}
