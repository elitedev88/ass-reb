'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { CartItem as CartItemType } from '@/types'
import { formatCurrency, formatDiscount } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemove: (id: number) => void
  isUpdating?: boolean
}

export function CartItem({ item, onUpdateQuantity, onRemove, isUpdating }: CartItemProps) {
  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1)
  }

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1)
    }
  }

  return (
    <div className="flex gap-4 py-4">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
              {item.title}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <p className="text-sm text-gray-900 font-medium">
                {formatCurrency(item.price)} each
              </p>
              {item.discountPercentage > 0 && (
                <>
                  <p className="text-xs text-gray-400 line-through">
                    {formatCurrency(item.originalPrice)}
                  </p>
                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                    {formatDiscount(item.discountPercentage)}
                  </span>
                </>
              )}
            </div>
          </div>
          <p className="text-sm font-medium text-gray-900 ml-2">
            {formatCurrency(item.subtotal)}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecrement}
              disabled={item.quantity <= 1 || isUpdating}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
              <span className="sr-only">Decrease quantity</span>
            </Button>
            
            <span className="w-12 text-center text-sm font-medium">
              {item.quantity}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleIncrement}
              disabled={isUpdating}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
            disabled={isUpdating}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
