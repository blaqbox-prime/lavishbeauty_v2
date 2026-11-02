import { getPayload } from 'payload'
import config from '@payload-config'

export default async function ConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })
  const booking = await payload.findByID({ collection: 'bookings', id, depth: 2 })
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 text-center">
      <h1 className="text-3xl font-bold">Booking confirmed</h1>
      <p className="mt-4">Thank you! Your booking #{booking.id} has been received.</p>
      <p className="mt-2 text-neutral-600">Status: {booking.status}</p>
      <a href="/" className="mt-8 inline-block rounded bg-black px-6 py-3 text-white">Back home</a>
    </div>
  )
}
