import { FastifyPluginAsync } from 'fastify'
import { sendMessageHandler } from './messages.handler'
import { sendMessageJsonSchema } from './messages.schema'
import { getMessageLogsHandler } from './messages.logs.handler'

const messagesRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/logs', {
    schema: {
      tags: ['Messages'],
      summary: 'List message logs',
      querystring: {
        type: 'object',
        properties: {
          channel:  { type: 'string', enum: ['EMAIL', 'FEISHU', 'DINGTALK', 'WECOM'] },
          status:   { type: 'string', enum: ['PENDING', 'SUCCESS', 'FAILED'] },
          page:     { type: 'string' },
          pageSize: { type: 'string' },
        },
      },
    },
    handler: getMessageLogsHandler,
  })

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
