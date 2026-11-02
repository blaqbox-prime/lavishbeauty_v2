'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function BookForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [serviceId, setServiceId] = useState(params.get('service') || '')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, date, startTime, name, email, phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Booking failed')
      router.push(`/book/confirmation/${data.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4">
      <div>
        <label className="block text-sm font-medium">Service ID</label>
        <input value={serviceId} onChange={(e) => setServiceId(e.target.value)} required className="mt-1 w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Start time (HH:MM)</label>
        <input value={startTime} onChange={(e) => setStartTime(e.target.value)} required placeholder="09:00" className="mt-1 w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <button disabled={loading} className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50">
        {loading ? 'Booking...' : 'Confirm booking'}
      </button>
    </form>
  )
}

export default function BookPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold">Book an appointment</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <BookForm />
      </Suspense>
    </div>
  )
}
