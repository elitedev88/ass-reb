import { CartData } from './cart'

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message: string
}

export interface CartResponse extends ApiResponse<CartData> {}

export interface AddToCartRequest {
  productId: number
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}

export interface ApiError {
  success: false
  message: string
  error?: {
    code: string
    details?: unknown
  }
}

export function isApiError(error: unknown): error is ApiError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'success' in error &&
    (error as ApiError).success === false
  )
}

export interface ApiConfig {
  baseURL: string
  timeout: number
  headers: Record<string, string>
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  data?: unknown
  params?: Record<string, string | number>
}
