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
      const res = await axios.post(url, {
        msg_type: 'post',
        content: {
          post: {
            zh_cn: {
              title: payload.title ?? '',
              content: [[{ tag: 'text', text: payload.content }]],
            },
          },
        },
      })
      if (res.data?.code !== 0) return { success: false, error: `Feishu error: ${res.data?.msg}` }
      return { success: true }
    } catch (err) {
      return this.handleError(err)
    }
  }
}
