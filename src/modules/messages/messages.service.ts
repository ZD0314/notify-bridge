import { PrismaClient } from '@prisma/client'
import { getProvider } from '../../providers/registry'
import { SendMessageInput } from './messages.schema'
import { Channel } from '../../types'

export async function sendMessage(
  prisma: PrismaClient,
  input: SendMessageInput,
  apiKeyId: string,
  requestId?: string
) {
  const log = await prisma.notifyLog.create({
    data: {
      apiKeyId,
      channel: input.channel as Channel,
      target: input.target ?? '',
      title: input.title,
      content: input.content,
      status: 'PENDING',
      requestId,
    },
  })

  const provider = getProvider(input.channel as Channel)
  const result = await provider.send({
    channel: input.channel as Channel,
    target: input.target ?? '',
    title: input.title,
    content: input.content,
    extra: input.extra,
  })

  const updated = await prisma.notifyLog.update({
    where: { id: log.id },
    data: {
      status: result.success ? 'SUCCESS' : 'FAILED',
      error: result.error ?? null,
    },
  })

  return updated
}
