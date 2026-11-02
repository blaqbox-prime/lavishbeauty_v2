import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')

const FROM = process.env.RESEND_FROM_EMAIL || 'bookings@beautysalon.com'

export async function sendBookingConfirmation(params: {
  to: string
  customerName: string
  serviceName: string
  date: string
  startTime: string
}) {
  if (!process.env.RESEND_API_KEY) return
  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `Booking confirmed: ${params.serviceName}`,
    html: `<p>Hi ${params.customerName},</p><p>Your booking for <strong>${params.serviceName}</strong> on ${params.date} at ${params.startTime} is confirmed.</p><p>See you soon!</p>`,
  })
}

export async function sendPaymentReceipt(params: {
  to: string
  customerName: string
  amount: number
  currency: string
  invoiceId: string | number
}) {
  if (!process.env.RESEND_API_KEY) return
  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `Payment receipt - ${params.currency} ${params.amount}`,
    html: `<p>Hi ${params.customerName},</p><p>We received your payment of ${params.currency} ${params.amount}. Invoice #${params.invoiceId}.</p>`,
  })
}
