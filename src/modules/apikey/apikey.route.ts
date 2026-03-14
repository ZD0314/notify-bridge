import { FastifyPluginAsync } from 'fastify'
import { createApiKeyHandler, listApiKeysHandler, disableApiKeyHandler } from './apikey.handler'

const apikeyRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post('/', {
    schema: {
      tags: ['API Keys'],
      summary: 'Create an API key',
      body: {
        type: 'object',
        required: ['name'],
        properties: { name: { type: 'string' } },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            key: { type: 'string' },
            enabled: { type: 'boolean' },
            createdAt: { type: 'string' },
          },
        },
      },
    },
    handler: createApiKeyHandler,
  })

  fastify.get('/', {
    schema: { tags: ['API Keys'], summary: 'List API keys' },
    handler: listApiKeysHandler,
  })

  fastify.delete('/:id', {
    schema: {
      tags: ['API Keys'],
      summary: 'Disable an API key',
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
      },
    },
    handler: disableApiKeyHandler,
  })
}

export default apikeyRoute
