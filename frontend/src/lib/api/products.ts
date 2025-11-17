import axios from 'axios'
import { Product, ProductsResponse, Category } from '@/types'

const PRODUCTS_API_URL = 'https://dummyjson.com'

const productsClient = axios.create({
  baseURL: PRODUCTS_API_URL,
  timeout: 10000,
})

export async function getProducts(limit: number = 30, skip: number = 0): Promise<ProductsResponse> {
  const response = await productsClient.get<ProductsResponse>('/products', {
    params: { limit, skip }
  })
  return response.data
}

export async function getProductById(id: number): Promise<Product> {
  const response = await productsClient.get<Product>(`/products/${id}`)
  return response.data
}

export async function searchProducts(query: string): Promise<ProductsResponse> {
  const response = await productsClient.get<ProductsResponse>('/products/search', {
    params: { q: query }
  })
  return response.data
}

export async function getProductsByCategory(category: string): Promise<ProductsResponse> {
  const response = await productsClient.get<ProductsResponse>(`/products/category/${category}`)
  return response.data
}

export async function getCategories(): Promise<Category[]> {
  const response = await productsClient.get<Category[]>('/products/categories')
  return response.data
}
