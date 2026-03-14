import { z } from 'zod'

export const SendMessageSchema = z.object({
  channel: z.enum(['EMAIL', 'FEISHU', 'DINGTALK', 'WECOM']),
  target: z.string().optional().default(''),
  title: z.string().max(200).optional(),
  content: z.string().min(1).max(4096),
  extra: z.record(z.unknown()).optional(),
})

export type SendMessageInput = z.infer<typeof SendMessageSchema>

export const sendMessageJsonSchema = {
  body: {
    type: 'object',
    required: ['channel', 'content'],
    properties: {
      channel: { type: 'string', enum: ['EMAIL', 'FEISHU', 'DINGTALK', 'WECOM'] },
      target: { type: 'string', description: 'Email address or webhook URL. Falls back to env config if omitted.' },
      title: { type: 'string', maxLength: 200 },
      content: { type: 'string', minLength: 1, maxLength: 4096 },
      extra: { type: 'object', additionalProperties: true },
    },
  },
}
