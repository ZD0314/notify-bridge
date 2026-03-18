import axios from 'axios'
import { BaseProvider } from './base.provider'
import { SendPayload, ProviderResult } from '../types'
import { config } from '../config'

export class FeishuProvider extends BaseProvider {
  readonly channel = 'FEISHU'

  async send(payload: SendPayload): Promise<ProviderResult> {
    const url = payload.target || config.feishu.webhookUrl
    if (!url) return { success: false, error: 'No Feishu webhook URL provided' }
    try {
      // 使用简单的 text 类型，避免富文本格式问题
      const messageContent = payload.title
        ? `**${payload.title}**\n\n${payload.content}`
        : payload.content

      const res = await axios.post(url, {
        msg_type: 'text',
        content: {
          text: messageContent,
        },
      }, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      })
      if (res.data?.code !== 0) return { success: false, error: `Feishu error: ${res.data?.msg}` }
      return { success: true }
    } catch (err) {
      return this.handleError(err)
    }
  }
}
