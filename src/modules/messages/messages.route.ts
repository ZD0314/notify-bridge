import { FastifyPluginAsync } from 'fastify'
import { sendMessageHandler } from './messages.handler'
import { sendMessageJsonSchema } from './messages.schema'

const messagesRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post('/send', {
    schema: {
      ...sendMessageJsonSchema,
      tags: ['Messages'],
      summary: 'Send a notification message',
      response: {
        202: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                logId: { type: 'string' },
                status: { type: 'string', enum: ['SUCCESS', 'FAILED', 'PENDING'] },
              },
            },
          },
        },
      },
    },
    handler: sendMessageHandler,
  })
}

export default messagesRoute
