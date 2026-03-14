import Fastify from 'fastify'
import { config } from './config'
import prismaPlugin from './plugins/prisma'
import authPlugin from './plugins/auth'
import swaggerPlugin from './plugins/swagger'
import errorHandlerPlugin from './plugins/error-handler'
import messagesRoute from './modules/messages/messages.route'
import logRoute from './modules/log/log.route'
import apikeyRoute from './modules/apikey/apikey.route'

export async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: config.server.nodeEnv === 'production' ? 'info' : 'debug',
      transport: config.server.nodeEnv !== 'production'
        ? { target: 'pino-pretty' }
        : undefined,
    },
  })

  // 注册顺序：swagger → prisma → auth → error-handler → routes
  await fastify.register(swaggerPlugin)
  await fastify.register(prismaPlugin)
  await fastify.register(authPlugin)
  await fastify.register(errorHandlerPlugin)

  await fastify.register(messagesRoute, { prefix: '/api/v1/messages' })
  await fastify.register(logRoute,      { prefix: '/api/v1/logs' })
  await fastify.register(apikeyRoute,   { prefix: '/api/v1/apikeys' })

  fastify.get('/health', { schema: { hide: true } }, async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }))

  return fastify
}
