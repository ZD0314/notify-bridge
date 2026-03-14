import { FastifyPluginAsync } from 'fastify'
import { sendNotifyHandler } from './notify.handler'
import { sendNotifyJsonSchema } from './notify.schema'

const notifyRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post('/send', {
    schema: {
      ...sendNotifyJsonSchema,
      tags: ['Notify'],
      summary: 'Send a notification',
      response: {
        202: {
          type: 'object',
          properties: {
            logId: { type: 'string' },
            status: { type: 'string' },
          },
        },
      },
    },
    handler: sendNotifyHandler,
  })
}

export default notifyRoute
