import { describe, it, expect } from 'vitest'
import { SendMessageSchema } from '../../src/modules/messages/messages.schema'

describe('SendMessageSchema', () => {
  it('合法请求通过校验', () => {
    const result = SendMessageSchema.safeParse({
      channel: 'FEISHU',
      content: '测试消息',
    })
    expect(result.success).toBe(true)
  })

  it('target 缺省时默认为空字符串', () => {
    const result = SendMessageSchema.safeParse({ channel: 'WECOM', content: 'hi' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.target).toBe('')
  })

  it('channel 非法时校验失败', () => {
    const result = SendMessageSchema.safeParse({ channel: 'SLACK', content: 'hi' })
    expect(result.success).toBe(false)
  })

  it('content 为空时校验失败', () => {
    const result = SendMessageSchema.safeParse({ channel: 'EMAIL', content: '' })
    expect(result.success).toBe(false)
  })

  it('content 超过 4096 字符时校验失败', () => {
    const result = SendMessageSchema.safeParse({
      channel: 'EMAIL',
      content: 'a'.repeat(4097),
    })
    expect(result.success).toBe(false)
  })

  it('title 超过 200 字符时校验失败', () => {
    const result = SendMessageSchema.safeParse({
      channel: 'DINGTALK',
      content: 'hello',
      title: 'x'.repeat(201),
    })
    expect(result.success).toBe(false)
  })

  it('extra 为任意对象时通过', () => {
    const result = SendMessageSchema.safeParse({
      channel: 'EMAIL',
      content: 'hello',
      extra: { html: '<b>bold</b>', foo: 123 },
    })
    expect(result.success).toBe(true)
  })
})
