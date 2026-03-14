import { BaseProvider } from './base.provider'
import { EmailProvider } from './email.provider'
import { FeishuProvider } from './feishu.provider'
import { DingTalkProvider } from './dingtalk.provider'
import { WeComProvider } from './wecom.provider'
import { Channel } from '../types'

const providers = new Map<Channel, BaseProvider>([
  ['EMAIL',    new EmailProvider()],
  ['FEISHU',   new FeishuProvider()],
  ['DINGTALK', new DingTalkProvider()],
  ['WECOM',    new WeComProvider()],
])

export function getProvider(channel: Channel): BaseProvider {
  const p = providers.get(channel)
  if (!p) throw new Error(`Unknown channel: ${channel}`)
  return p
}
