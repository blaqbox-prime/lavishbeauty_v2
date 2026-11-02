/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: 'Beauty Salon',
  description: 'Book your beauty appointment online.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <header className="border-b">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="text-xl font-bold">
            Beauty Salon
          </a>
          <div className="flex gap-6 text-sm">
            <a href="/services">Services</a>
            <a href="/book">Book</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/contact">Contact</a>
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="border-t py-8 text-center text-sm text-neutral-500">
        &copy; {new Date().getFullYear()} Beauty Salon
      </footer>
    </div>
  )
}
