import { FastifyRequest, FastifyReply } from 'fastify'
import { SendMessageSchema, SendMessageInput } from './messages.schema'
import { sendMessage } from './messages.service'
import { ok, fail } from '../../utils/response'

export async function sendMessageHandler(
  request: FastifyRequest<{ Body: SendMessageInput }>,
  reply: FastifyReply
) {
  const parsed = SendMessageSchema.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send(fail(JSON.stringify(parsed.error.flatten())))
  }

  const log = await sendMessage(
    request.server.prisma,
    parsed.data,
    request.apiKey.id,
    request.id
  )

  return reply.status(202).send(ok({ logId: log.id, status: log.status }))
}
