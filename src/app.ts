import Fastify from 'fastify'
import { config } from './config'
import prismaPlugin from './plugins/prisma'
import authPlugin from './plugins/auth'
import swaggerPlugin from './plugins/swagger'
import notifyRoute from './modules/notify/notify.route'
import logRoute from './modules/log/log.route'
import apikeyRoute from './modules/apikey/apikey.route'

async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: config.server.nodeEnv === 'production' ? 'info' : 'debug',
      transport: config.server.nodeEnv !== 'production'
        ? { target: 'pino-pretty' }
        : undefined,
    },
  })

  // 注册顺序：swagger → prisma → auth → routes
  await fastify.register(swaggerPlugin)
  await fastify.register(prismaPlugin)
  await fastify.register(authPlugin)

  await fastify.register(notifyRoute, { prefix: '/api/v1/notify' })
  await fastify.register(logRoute,    { prefix: '/api/v1/logs' })
  await fastify.register(apikeyRoute, { prefix: '/api/v1/apikeys' })

  fastify.get('/health', { schema: { hide: true } }, async () => ({ status: 'ok' }))

  return fastify
}

async function main() {
  const app = await buildApp()
  try {
    await app.listen({ port: config.server.port, host: config.server.host })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

main()
