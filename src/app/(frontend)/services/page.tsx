import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'

export default async function ServicesPage() {
  const payload = await getPayload({ config })
  const services = await payload.find({ collection: 'services', where: { active: { equals: true } }, depth: 1, limit: 100 })
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold">Our Services</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {services.docs.map((s: any) => (
          <div key={s.id} className="rounded border p-6">
            <h2 className="text-xl font-semibold">{s.name}</h2>
            <p className="mt-2 text-sm text-neutral-600">{s.description?.root?.children?.[0]?.children?.[0]?.text || ''}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-bold">${s.price}</span>
              <span className="text-sm text-neutral-500">{s.duration} min</span>
            </div>
            <Link href={`/book?service=${s.id}`} className="mt-4 block rounded bg-black px-4 py-2 text-center text-white">Book</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
