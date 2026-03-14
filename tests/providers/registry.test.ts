import { describe, it, expect } from 'vitest'
import { getProvider } from '../../src/providers/registry'
import { EmailProvider } from '../../src/providers/email.provider'
import { FeishuProvider } from '../../src/providers/feishu.provider'
import { DingTalkProvider } from '../../src/providers/dingtalk.provider'
import { WeComProvider } from '../../src/providers/wecom.provider'

describe('provider registry', () => {
  it('EMAIL 返回 EmailProvider', () => {
    expect(getProvider('EMAIL')).toBeInstanceOf(EmailProvider)
  })

  it('FEISHU 返回 FeishuProvider', () => {
    expect(getProvider('FEISHU')).toBeInstanceOf(FeishuProvider)
  })

  it('DINGTALK 返回 DingTalkProvider', () => {
    expect(getProvider('DINGTALK')).toBeInstanceOf(DingTalkProvider)
  })

  it('WECOM 返回 WeComProvider', () => {
    expect(getProvider('WECOM')).toBeInstanceOf(WeComProvider)
  })

  it('未知 channel 抛出错误', () => {
    expect(() => getProvider('UNKNOWN' as any)).toThrow('Unknown channel: UNKNOWN')
  })

  it('每次返回同一个实例（单例）', () => {
    expect(getProvider('EMAIL')).toBe(getProvider('EMAIL'))
  })
})
