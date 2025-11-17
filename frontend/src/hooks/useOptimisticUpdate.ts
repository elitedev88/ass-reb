import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { addToCart, updateCartItem, removeFromCart } from '@/lib/api'
import { useCart } from '@/contexts/CartContext'
import { Product, AddToCartRequest, UpdateCartItemRequest, calculateCartSummary } from '@/types'

export function useOptimisticUpdate() {
  const { dispatch, state } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)

  const optimisticAddToCart = useMutation({
    mutationFn: async (product: Product) => {
      dispatch({ type: 'ADD_ITEM', payload: product })
      
      const request: AddToCartRequest = {
        productId: product.id,
        quantity: 1
      }
      return addToCart(request)
    },
    onError: () => {
      toast.error('Failed to add item to cart', {
        description: 'Please try again later'
      })
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' })
    },
    onSuccess: () => {
    }
  })

  const optimisticUpdateQuantity = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const previousItems = [...state.items]
      
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
      
      const request: UpdateCartItemRequest = { quantity }
      return updateCartItem(id, request).catch((error) => {
        dispatch({ type: 'SET_CART_DATA', payload: { items: previousItems, summary: calculateCartSummary(previousItems) } })
        throw error
      })
    },
    onError: () => {
      toast.error('Failed to update quantity', {
        description: 'Please try again later'
      })
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update quantity' })
    },
    onSuccess: () => {
    }
  })

  const optimisticRemoveFromCart = useMutation({
    mutationFn: async (id: number) => {
      const previousItems = [...state.items]
      
      dispatch({ type: 'REMOVE_ITEM', payload: id })
      
      return removeFromCart(id).catch((error) => {
        dispatch({ type: 'SET_CART_DATA', payload: { items: previousItems, summary: calculateCartSummary(previousItems) } })
        throw error
      })
    },
    onError: () => {
      toast.error('Failed to remove item from cart', {
        description: 'Please try again later'
      })
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' })
    },
    onSuccess: () => {
      toast.success('Item removed from cart')
    }
  })

  const debouncedUpdateQuantity = useCallback((id: number, quantity: number) => {
    setIsUpdating(true)
    const timeoutId = setTimeout(() => {
      optimisticUpdateQuantity.mutate({ id, quantity })
      setIsUpdating(false)
    }, 500)

    return () => {
      clearTimeout(timeoutId)
      setIsUpdating(false)
    }
  }, [optimisticUpdateQuantity])

  return {
    addToCart: optimisticAddToCart.mutate,
    updateQuantity: debouncedUpdateQuantity,
    removeFromCart: optimisticRemoveFromCart.mutate,
    isAddingToCart: optimisticAddToCart.isPending,
    isUpdatingQuantity: optimisticUpdateQuantity.isPending || isUpdating,
    isRemovingFromCart: optimisticRemoveFromCart.isPending,
  }
}
