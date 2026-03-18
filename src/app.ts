import Fastify from 'fastify'
import { config } from './config'
import prismaPlugin from './plugins/prisma'
import authPlugin from './plugins/auth'
import swaggerPlugin from './plugins/swagger'
import errorHandlerPlugin from './plugins/error-handler'
import messagesRoute from './modules/messages/messages.route'
import logRoute from './modules/log/log.route'
import apikeyRoute from './modules/apikey/apikey.route'
import notifyRoute from './modules/notify/notify.route'

export async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: config.server.nodeEnv === 'production' ? 'info' : 'debug',
      transport: config.server.nodeEnv !== 'production'
        ? { target: 'pino-pretty' }
        : undefined,
    },
    // 强制使用 UTF-8 编码
    bodyLimit: 1048576, // 1MB
  })

  // 设置 UTF-8 编码
  fastify.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body: string, done) => {
    try {
      const parsed = JSON.parse(body)
      done(null, parsed)
    } catch (err) {
      done(err as Error, null)
    }
  })

  // 注册顺序：swagger → prisma → auth → error-handler → routes
  await fastify.register(swaggerPlugin)
  await fastify.register(prismaPlugin)
  await fastify.register(authPlugin)
  await fastify.register(errorHandlerPlugin)

  await fastify.register(messagesRoute, { prefix: '/api/v1/messages' })
  await fastify.register(logRoute,      { prefix: '/api/v1/logs' })
  await fastify.register(apikeyRoute,   { prefix: '/api/v1/apikeys' })
  await fastify.register(notifyRoute,   { prefix: '/api/v1/notify' })

  fastify.get('/health', { schema: { hide: true } }, async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }))

  return fastify
}
