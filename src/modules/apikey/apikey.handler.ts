import { FastifyRequest, FastifyReply } from 'fastify'
import { createApiKey, listApiKeys, disableApiKey } from './apikey.service'

export async function createApiKeyHandler(
  request: FastifyRequest<{ Body: { name: string } }>,
  reply: FastifyReply
) {
  if (!request.body?.name) {
    return reply.status(400).send({ error: 'name is required' })
  }
  const apiKey = await createApiKey(request.server.prisma, request.body.name)
  return reply.status(201).send(apiKey)
}

export async function listApiKeysHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const keys = await listApiKeys(request.server.prisma)
  return reply.send(keys)
}

export async function disableApiKeyHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  await disableApiKey(request.server.prisma, request.params.id)
  return reply.status(204).send()
}
