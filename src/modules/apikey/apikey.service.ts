import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

export function generateKey(): string {
  return 'nb_' + crypto.randomBytes(24).toString('hex')
}

export async function createApiKey(prisma: PrismaClient, name: string) {
  return prisma.apiKey.create({ data: { name, key: generateKey() } })
}

export async function listApiKeys(prisma: PrismaClient) {
  return prisma.apiKey.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, enabled: true, createdAt: true },
  })
}

export async function disableApiKey(prisma: PrismaClient, id: string) {
  return prisma.apiKey.update({ where: { id }, data: { enabled: false } })
}
