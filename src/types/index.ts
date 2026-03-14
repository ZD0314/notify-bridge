import { ApiKey } from '@prisma/client'

declare module 'fastify' {
  interface FastifyRequest {
    apiKey: ApiKey
  }
}

export type Channel = 'EMAIL' | 'FEISHU' | 'DINGTALK' | 'WECOM'
export type LogStatus = 'PENDING' | 'SUCCESS' | 'FAILED'

export interface SendPayload {
  channel: Channel
  target: string
  title?: string
  content: string
  extra?: Record<string, unknown>
}

export interface ProviderResult {
  success: boolean
  error?: string
}
