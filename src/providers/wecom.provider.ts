import axios from 'axios'
import { BaseProvider } from './base.provider'
import { SendPayload, ProviderResult } from '../types'
import { config } from '../config'

export class WeComProvider extends BaseProvider {
  readonly channel = 'WECOM'

  async send(payload: SendPayload): Promise<ProviderResult> {
    const url = payload.target || config.wecom.webhookUrl
    if (!url) return { success: false, error: 'No WeCom webhook URL provided' }
    try {
      const res = await axios.post(url, {
        msgtype: 'markdown',
        markdown: {
          content: `**${payload.title ?? 'Notification'}**\n${payload.content}`,
        },
      })
      if (res.data?.errcode !== 0) return { success: false, error: `WeCom error: ${res.data?.errmsg}` }
      return { success: true }
    } catch (err) {
      return this.handleError(err)
    }
  }
}
