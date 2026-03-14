import { SendPayload, ProviderResult } from '../types'

export abstract class BaseProvider {
  abstract readonly channel: string
  abstract send(payload: SendPayload): Promise<ProviderResult>

  protected handleError(error: unknown): ProviderResult {
    const message = error instanceof Error ? error.message : String(error)
    return { success: false, error: message }
  }
}
