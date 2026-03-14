import axios from 'axios'
import crypto from 'crypto'
import { BaseProvider } from './base.provider'
import { SendPayload, ProviderResult } from '../types'
import { config } from '../config'

export class DingTalkProvider extends BaseProvider {
  readonly channel = 'DINGTALK'

  private sign(timestamp: number): string {
    const secret = config.dingtalk.secret
    if (!secret) return ''
    const str = `${timestamp}\n${secret}`
    return encodeURIComponent(crypto.createHmac('sha256', secret).update(str).digest('base64'))
  }

  async send(payload: SendPayload): Promise<ProviderResult> {
    let url = payload.target || config.dingtalk.webhookUrl
    if (!url) return { success: false, error: 'No DingTalk webhook URL provided' }
    if (config.dingtalk.secret) {
      const ts = Date.now()
      url += `&timestamp=${ts}&sign=${this.sign(ts)}`
    }
    try {
      const res = await axios.post(url, {
        msgtype: 'markdown',
        markdown: {
          title: payload.title ?? 'Notification',
          text: `### ${payload.title ?? 'Notification'}\n${payload.content}`,
        },
      })
      if (res.data?.errcode !== 0) return { success: false, error: `DingTalk error: ${res.data?.errmsg}` }
      return { success: true }
    } catch (err) {
      return this.handleError(err)
    }
  }
}
