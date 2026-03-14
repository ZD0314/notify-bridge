export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export function ok<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, ...(message ? { message } : {}) }
}

export function fail(error: string): ApiResponse {
  return { success: false, error }
}
