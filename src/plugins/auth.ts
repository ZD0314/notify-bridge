import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

const SKIP_PATHS = ['/health', '/docs', '/api/v1/apikeys']

const authPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.addHook('onRequest', async (request, reply) => {
    if (SKIP_PATHS.some(p => request.url.startsWith(p))) return

    const key = request.headers['x-api-key']
    if (!key || typeof key !== 'string') {
      return reply.status(401).send({ error: 'Missing X-API-Key header' })
    }

    const apiKey = await fastify.prisma.apiKey.findUnique({ where: { key } })
    if (!apiKey || !apiKey.enabled) {
      return reply.status(401).send({ error: 'Invalid or disabled API key' })
    }

    request.apiKey = apiKey
  })
})

export default authPlugin
