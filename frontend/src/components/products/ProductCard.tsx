'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ShoppingCart, Star } from 'lucide-react'
import { toast } from 'sonner'
import { Product } from '@/types'
import { cn, formatCurrency, formatDiscount, calculateDiscountedPrice, formatCategoryName } from '@/lib/utils'
import { useCart } from '@/hooks'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCart()
  const [isHovered, setIsHovered] = useState(false)
  const searchParams = useSearchParams()
  
  const discountedPrice = product.discountPercentage > 0 
    ? calculateDiscountedPrice(product.price, product.discountPercentage)
    : product.price

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    toast.success(`${product.title} added to cart!`, {
      description: `Price: ${formatCurrency(discountedPrice)}`,
      action: {
        label: 'View Cart',
        onClick: () => openCart(),
      },
    })
  }

  const productUrl = `/products/${product.id}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

  return (
    <Link href={productUrl} className="block">
      <div 
        className="relative h-full overflow-hidden rounded-lg bg-white border border-gray-200 transition-all hover:shadow-lg flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {product.discountPercentage > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
            {formatDiscount(product.discountPercentage)}
          </div>
        )}

        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-2 right-2 z-10 bg-orange-500 text-white px-2 py-1 text-xs font-semibold rounded">
            Only {product.stock} left
          </div>
        )}

        <div className="aspect-square relative bg-gray-100 overflow-hidden">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className={cn(
              "object-cover transition-transform duration-300",
              isHovered && "scale-105"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="text-xs text-gray-500 mb-1">
            {[product.brand, formatCategoryName(product.category)]
              .filter(Boolean)
              .join(' • ')}
          </div>

          <h3 className="font-medium text-gray-900 line-clamp-1 mb-2" title={product.title}>
            {product.title}
          </h3>

          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-400">({product.reviews?.length || 0})</span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center justify-between mt-auto">
            <div>
              {product.discountPercentage > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(discountedPrice)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                product.stock > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
            >
              <ShoppingCart className="h-4 w-4" />
              {product.stock === 0 ? 'Out of Stock' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
