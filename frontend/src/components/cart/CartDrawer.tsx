'use client'

import { ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { useCart, useOptimisticUpdate } from '@/hooks'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet'

export function CartDrawer() {
  const { state, closeCart, getCartSummary, getTotalItems } = useCart()
  const { updateQuantity, removeFromCart, isUpdatingQuantity, isRemovingFromCart } = useOptimisticUpdate()
  
  const summary = getCartSummary()
  const totalItems = getTotalItems()
  const isUpdating = isUpdatingQuantity || isRemovingFromCart

  return (
    <Sheet open={state.isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({totalItems})</SheetTitle>
          <SheetDescription>
            Review your items and proceed to checkout
          </SheetDescription>
        </SheetHeader>

        {state.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Add some products to your cart to get started
            </p>
            <SheetClose asChild>
              <Button variant="outline">Continue Shopping</Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="divide-y">
                {state.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                    isUpdating={isUpdating}
                  />
                ))}
              </div>
            </div>

            <SheetFooter className="flex-col space-y-4">
              <CartSummary summary={summary} />
              
              <div className="space-y-2">
                <Button 
                  className="w-full cursor-pointer" 
                  size="lg"
                  onClick={() => {
                    toast.info('Checkout functionality is not available in this demo', {
                      description: 'This is a technical assessment focused on cart management.',
                      duration: 5000,
                    })
                  }}
                >
                  Proceed to Checkout
                </Button>
                <SheetClose asChild>
                  <Button variant="outline" className="w-full cursor-pointer" size="lg">
                    Continue Shopping
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        )}

        {state.error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{state.error}</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
