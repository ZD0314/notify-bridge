import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

const errorHandlerPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode ?? 500

    // 校验错误（Fastify 内置 schema 校验）
    if (statusCode === 400) {
      return reply.status(400).send({ success: false, error: error.message })
    }

    // 未预期的服务端错误，不暴露内部细节
    if (statusCode >= 500) {
      request.log.error({ err: error }, 'Internal server error')
      return reply.status(500).send({ success: false, error: 'Internal server error' })
    }

    return reply.status(statusCode).send({ success: false, error: error.message })
  })

  // 404 处理
  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({ success: false, error: `Route ${request.method} ${request.url} not found` })
  })
})

export default errorHandlerPlugin
