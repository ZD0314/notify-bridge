import { describe, it, expect } from 'vitest'
import { interpolate } from '../../src/utils/interpolate'

describe('interpolate', () => {
  it('替换单个变量', () => {
    expect(interpolate('Hello {{name}}', { name: 'World' })).toBe('Hello World')
  })

  it('替换多个变量', () => {
    expect(interpolate('{{greeting}}, {{name}}!', { greeting: 'Hi', name: 'Alice' }))
      .toBe('Hi, Alice!')
  })

  it('未提供的变量保留原样', () => {
    expect(interpolate('Hello {{name}}', {})).toBe('Hello {{name}}')
  })

  it('无变量时原样返回', () => {
    expect(interpolate('no variables here', { name: 'x' })).toBe('no variables here')
  })

  it('同一变量多次出现', () => {
    expect(interpolate('{{x}} and {{x}}', { x: 'foo' })).toBe('foo and foo')
  })
})
