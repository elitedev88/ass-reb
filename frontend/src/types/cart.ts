import { Product } from './product'

export interface CartItem {
  id: number
  productId: number
  title: string
  price: number
  originalPrice: number
  discountPercentage: number
  quantity: number
  subtotal: number
  thumbnail: string
}

export interface CartSummary {
  subtotal: number
  tax: number
  shipping: number
  total: number
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
  error: string | null
}

export interface CartData {
  items: CartItem[]
  summary: CartSummary
}
export type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'SET_CART_DATA'; payload: CartData }
  | { type: 'CLEAR_CART' }

export function createCartItem(product: Product, quantity: number = 1): Omit<CartItem, 'id'> {
  const discountedPrice = product.discountPercentage > 0
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price
  
  const finalPrice = Math.round(discountedPrice * 100) / 100
  
  return {
    productId: product.id,
    title: product.title,
    price: finalPrice,
    originalPrice: product.price,
    discountPercentage: product.discountPercentage,
    quantity,
    subtotal: finalPrice * quantity,
    thumbnail: product.thumbnail
  }
}

export function calculateCartSummary(items: CartItem[]): CartSummary {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const tax = subtotal * 0.1
  const shipping = items.length > 0 ? 10 : 0
  const total = subtotal + tax + shipping

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    total: Math.round(total * 100) / 100
  }
}
