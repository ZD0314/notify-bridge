import { FastifyRequest, FastifyReply } from 'fastify'
import { getLogs, getLogById } from './log.service'

export async function getLogsHandler(
  request: FastifyRequest<{
    Querystring: { channel?: string; status?: string; page?: string; limit?: string }
  }>,
  reply: FastifyReply
) {
  const { channel, status, page, limit } = request.query
  const result = await getLogs(request.server.prisma, {
    channel,
    status,
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? Math.min(parseInt(limit, 10), 100) : 20,
  })
  return reply.send(result)
}

export async function getLogByIdHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const log = await getLogById(request.server.prisma, request.params.id)
  if (!log) return reply.status(404).send({ error: 'Log not found' })
  return reply.send(log)
}
