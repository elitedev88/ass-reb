'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { 
  CartState, 
  CartAction, 
  Product, 
  CartData,
  createCartItem,
  calculateCartSummary 
} from '@/types'

const initialState: CartState = {
  items: [],
  isOpen: false,
  isLoading: false,
  error: null
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.productId === action.payload.id)
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.productId === action.payload.id
            ? { ...item, quantity: item.quantity + 1, subtotal: item.price * (item.quantity + 1) }
            : item
        )
        return { ...state, items: updatedItems }
      } else {
        const newItem = {
          id: Date.now(),
          ...createCartItem(action.payload)
        }
        return { ...state, items: [...state.items, newItem] }
      }
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id)
        }
      }
      
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity, subtotal: item.price * action.payload.quantity }
          : item
      )
      return { ...state, items: updatedItems }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload }

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }

    case 'OPEN_CART':
      return { ...state, isOpen: true }

    case 'CLOSE_CART':
      return { ...state, isOpen: false }

    case 'SET_CART_DATA':
      return { ...state, items: action.payload.items }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addItem: (product: Product) => void
  updateQuantity: (id: number, quantity: number) => void
  removeItem: (id: number) => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  clearCart: () => void
  getCartSummary: () => ReturnType<typeof calculateCartSummary>
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const cartData: CartData = JSON.parse(savedCart)
        dispatch({ type: 'SET_CART_DATA', payload: cartData })
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error)
      }
    }
  }, [])

  useEffect(() => {
    if (state.items.length > 0) {
      const cartData: CartData = {
        items: state.items,
        summary: calculateCartSummary(state.items)
      }
      localStorage.setItem('cart', JSON.stringify(cartData))
    } else {
      localStorage.removeItem('cart')
    }
  }, [state.items])

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product })
  }

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' })
  }

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getCartSummary = () => {
    return calculateCartSummary(state.items)
  }

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const value: CartContextType = {
    state,
    dispatch,
    addItem,
    updateQuantity,
    removeItem,
    toggleCart,
    openCart,
    closeCart,
    clearCart,
    getCartSummary,
    getTotalItems
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
