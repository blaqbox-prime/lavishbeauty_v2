import { getPayload } from 'payload'
import config from '@payload-config'

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })
  const inv = await payload.findByID({ collection: 'invoices', id, depth: 2 })
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-bold">Invoice #{inv.id}</h1>
      <p className="mt-2">Status: {inv.status}</p>
      <table className="mt-6 w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Description</th>
            <th className="py-2 text-right">Qty</th>
            <th className="py-2 text-right">Unit</th>
            <th className="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {(inv.lineItems || []).map((li: any, i: number) => (
            <tr key={i} className="border-b">
              <td className="py-2">{li.description}</td>
              <td className="py-2 text-right">{li.quantity}</td>
              <td className="py-2 text-right">${li.unitPrice}</td>
              <td className="py-2 text-right">${li.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-right">
        <p>Subtotal: ${inv.subtotal}</p>
        <p>Tax: ${inv.tax}</p>
        <p className="font-bold">Total: ${inv.total}</p>
      </div>
      <button onClick={() => window.print()} className="mt-6 rounded bg-black px-4 py-2 text-white print:hidden">Print</button>
    </div>
  )
}
