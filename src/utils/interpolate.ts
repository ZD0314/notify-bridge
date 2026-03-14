/**
 * 模板变量替换工具
 * 将字符串中的 {{key}} 替换为 variables 对象中对应的值
 */
export function interpolate(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] ?? `{{${key}}}`)
}
