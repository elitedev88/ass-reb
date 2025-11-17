import { apiClient } from './client'
import { CartResponse, AddToCartRequest, UpdateCartItemRequest, CartData } from '@/types'

export async function getCart(): Promise<CartData> {
  const response = await apiClient.get<CartResponse>('/cart')
  return response.data.data
}

export async function addToCart(request: AddToCartRequest): Promise<CartData> {
  const response = await apiClient.post<CartResponse>('/cart/add', request)
  return response.data.data
}

export async function updateCartItem(id: number, request: UpdateCartItemRequest): Promise<CartData> {
  const response = await apiClient.put<CartResponse>(`/cart/update/${id}`, request)
  return response.data.data
}

export async function removeFromCart(id: number): Promise<CartData> {
  const response = await apiClient.delete<CartResponse>(`/cart/remove/${id}`)
  return response.data.data
}
