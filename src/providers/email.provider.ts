import nodemailer from 'nodemailer'
import { BaseProvider } from './base.provider'
import { SendPayload, ProviderResult } from '../types'
import { config } from '../config'

export class EmailProvider extends BaseProvider {
  readonly channel = 'EMAIL'
  private transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
  })

  async send(payload: SendPayload): Promise<ProviderResult> {
    try {
      await this.transporter.sendMail({
        from: config.smtp.from,
        to: payload.target,
        subject: payload.title ?? '(no subject)',
        text: payload.content,
        html: payload.extra?.html as string | undefined,
      })
      return { success: true }
    } catch (err) {
      return this.handleError(err)
    }
  }
}
