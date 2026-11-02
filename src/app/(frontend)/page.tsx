import Link from 'next/link'

export default function LandingPage() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight">Look your best, book with ease</h1>
        <p className="mt-4 text-lg text-neutral-600">
          Hair, nails, and makeup services by skilled professionals. Book online in minutes.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/book" className="rounded bg-black px-6 py-3 text-white">
            Book now
          </Link>
          <Link href="/services" className="rounded border px-6 py-3">
            View services
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="text-2xl font-semibold">Why choose us</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {['Expert stylists', 'Flexible booking', 'Premium products'].map((t) => (
            <div key={t} className="rounded border p-6">
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-neutral-600">Quality service tailored to you.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
