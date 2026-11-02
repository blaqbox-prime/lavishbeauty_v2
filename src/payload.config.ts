import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { resendAdapter } from '@payloadcms/email-resend'
import sharp from 'sharp'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Services } from './collections/Services'
import { Customers } from './collections/Customers'
import { Bookings } from './collections/Bookings'
import { Invoices } from './collections/Invoices'
import { Testimonials } from './collections/Testimonials'
import { Settings } from './globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' | Beauty Salon Admin',
    },
  },
  collections: [Users, Media, Categories, Services, Customers, Bookings, Invoices, Testimonials],
  globals: [Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  email: resendAdapter({
    defaultFromAddress: process.env.RESEND_FROM_EMAIL || 'bookings@example.com',
    defaultFromName: 'Beauty Salon',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  upload: {
    limits: {
      fileSize: 5000000,
    },
  },
  plugins: [
    seoPlugin({
      collections: ['services'],
      uploadsCollection: 'media',
    }),
    formBuilderPlugin({}),
  ],
})
