import { PrismaClient } from '@prisma/client'

export async function getMessageLogs(
  prisma: PrismaClient,
  query: { channel?: string; status?: string; page?: number; pageSize?: number }
) {
  const { channel, status, page = 1, pageSize = 20 } = query
  const where = {
    ...(channel ? { channel: channel as any } : {}),
    ...(status  ? { status:  status  as any } : {}),
  }
  const [total, items] = await Promise.all([
    prisma.notifyLog.count({ where }),
    prisma.notifyLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { apiKey: { select: { name: true } } },
    }),
  ])
  return { total, page, pageSize, totalPages: Math.ceil(total / pageSize), items }
}
