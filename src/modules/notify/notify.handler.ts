import { FastifyRequest, FastifyReply } from 'fastify'
import { SendNotifySchema, SendNotifyInput } from './notify.schema'
import { sendNotify } from './notify.service'

export async function sendNotifyHandler(
  request: FastifyRequest<{ Body: SendNotifyInput }>,
  reply: FastifyReply
) {
  const parsed = SendNotifySchema.safeParse(request.body)
  if (!parsed.success) {
    return reply.status(400).send({ error: parsed.error.flatten() })
  }

  const log = await sendNotify(
    request.server.prisma,
    parsed.data,
    request.apiKey.id,
    request.id
  )
  return reply.status(202).send({ logId: log.id, status: log.status })
}
