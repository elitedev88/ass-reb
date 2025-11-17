import axios, { AxiosInstance, AxiosError } from 'axios'
import { isApiError } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response) {
      const data = error.response.data
      if (isApiError(data)) {
        return Promise.reject(new Error(data.message))
      }
    } else if (error.request) {
      return Promise.reject(new Error('Network error. Please check your connection.'))
    }
    
    return Promise.reject(error)
  }
)

export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (isApiError(error)) {
    return error.message
  }
  return 'An unexpected error occurred'
}

export const retryConfig = {
  retries: 3,
  retryDelay: (retryCount: number) => {
    return Math.pow(2, retryCount) * 1000
  },
  retryCondition: (error: AxiosError) => {
    return !error.response || (error.response.status >= 500 && error.response.status < 600)
  },
}
