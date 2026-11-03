import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import { User } from '@/payload-types.js'

export type AppUser =
  | User
  | {
      email: string
      password: string
    }

export const testUser: AppUser = {
  email: 'dev@payloadcms.com',
  password: 'test',
  name: 'Test User',
  role: 'admin',
  id: 0,
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  collection: 'users',
}

/**
 * Seeds a test user for e2e admin tests.
 */
export async function seedTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  // Delete existing test user if any
  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })

  // Create fresh test user
  await payload.create({
    collection: 'users',
    data: testUser as User,
    draft: false,
  })
}

/**
 * Cleans up test user after tests
 */
export async function cleanupTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })
}
