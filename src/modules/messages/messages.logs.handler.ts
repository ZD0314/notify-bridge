import { FastifyRequest, FastifyReply } from 'fastify'
import { getMessageLogs } from './messages.logs.service'
import { ok } from '../../utils/response'

export async function getMessageLogsHandler(
  request: FastifyRequest<{
    Querystring: { channel?: string; status?: string; page?: string; pageSize?: string }
  }>,
  reply: FastifyReply
) {
  const { channel, status, page, pageSize } = request.query
  const result = await getMessageLogs(request.server.prisma, {
    channel,
    status,
    page:     page     ? parseInt(page, 10)                    : 1,
    pageSize: pageSize ? Math.min(parseInt(pageSize, 10), 100) : 20,
  })
  return reply.send(ok(result))
}
