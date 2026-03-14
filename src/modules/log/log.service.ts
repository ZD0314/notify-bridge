import { PrismaClient } from '@prisma/client'

export async function getLogs(
  prisma: PrismaClient,
  query: { channel?: string; status?: string; page?: number; limit?: number }
) {
  const { channel, status, page = 1, limit = 20 } = query
  const where = {
    ...(channel ? { channel: channel as any } : {}),
    ...(status  ? { status:  status  as any } : {}),
  }
  const [total, items] = await Promise.all([
    prisma.notifyLog.count({ where }),
    prisma.notifyLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { apiKey: { select: { name: true } } },
    }),
  ])
  return { total, page, limit, items }
}

export async function getLogById(prisma: PrismaClient, id: string) {
  return prisma.notifyLog.findUnique({
    where: { id },
    include: { apiKey: { select: { name: true } } },
  })
}
