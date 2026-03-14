import { FastifyPluginAsync } from 'fastify'
import { getLogsHandler, getLogByIdHandler } from './log.handler'

const logRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', {
    schema: {
      tags: ['Logs'],
      summary: 'List notification logs',
      querystring: {
        type: 'object',
        properties: {
          channel: { type: 'string', enum: ['EMAIL', 'FEISHU', 'DINGTALK', 'WECOM'] },
          status:  { type: 'string', enum: ['PENDING', 'SUCCESS', 'FAILED'] },
          page:    { type: 'string' },
          limit:   { type: 'string' },
        },
      },
    },
    handler: getLogsHandler,
  })

  fastify.get('/:id', {
    schema: {
      tags: ['Logs'],
      summary: 'Get a log by ID',
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
      },
    },
    handler: getLogByIdHandler,
  })
}

export default logRoute
