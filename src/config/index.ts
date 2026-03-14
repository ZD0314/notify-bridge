import 'dotenv/config'

function optional(key: string, fallback = ''): string {
  return process.env[key] ?? fallback
}

export const config = {
  server: {
    port: parseInt(optional('PORT', '3000'), 10),
    host: optional('HOST', '0.0.0.0'),
    nodeEnv: optional('NODE_ENV', 'development'),
  },
  smtp: {
    host: optional('SMTP_HOST'),
    port: parseInt(optional('SMTP_PORT', '587'), 10),
    secure: optional('SMTP_SECURE', 'false') === 'true',
    user: optional('SMTP_USER'),
    pass: optional('SMTP_PASS'),
    from: optional('SMTP_FROM', 'Notify Bridge <noreply@example.com>'),
  },
  feishu:   { webhookUrl: optional('FEISHU_WEBHOOK_URL') },
  dingtalk: { webhookUrl: optional('DINGTALK_WEBHOOK_URL'), secret: optional('DINGTALK_SECRET') },
  wecom:    { webhookUrl: optional('WECOM_WEBHOOK_URL') },
} as const
