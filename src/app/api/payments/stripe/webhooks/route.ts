import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { stripe } from '@/lib/stripe'
import { sendPaymentReceipt } from '@/lib/email'

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature') || ''
  const raw = await req.text()
  let event: any
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET || '')
  } catch (e: any) {
    return NextResponse.json({ error: `Webhook Error: ${e.message}` }, { status: 400 })
  }

  const payload = await getPayload({ config })

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const bookingId = session.metadata?.bookingId
    if (bookingId) {
      const booking = await payload.findByID({ collection: 'bookings', id: bookingId, depth: 2 })
      await payload.update({
        collection: 'bookings',
        id: bookingId,
        data: { paymentStatus: 'paid', status: 'confirmed', stripePaymentIntentId: session.payment_intent },
      })
      const inv = await payload.find({ collection: 'invoices', where: { booking: { equals: bookingId } }, limit: 1 })
      if (inv.docs[0]) {
        await payload.update({ collection: 'invoices', id: inv.docs[0].id, data: { status: 'paid' } })
      }
      const customer = booking.customer as any
      try {
        await sendPaymentReceipt({ to: customer.email, customerName: customer.name, amount: booking.price, currency: 'USD', invoiceId: inv.docs[0]?.id || bookingId })
      } catch {}
    }
  }

  return NextResponse.json({ received: true })
}
