'use client'

import { Suspense } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Product } from '@/types'
import { ProductCard } from './ProductCard'
import { cn } from '@/lib/utils'
import { useCarousel } from '@/hooks/useCarousel'

interface ProductCarouselProps {
  products: Product[]
  title?: string
  autoScroll?: boolean
  scrollInterval?: number
}

export function ProductCarousel({ 
  products, 
  title = "Featured Products",
  autoScroll = true,
  scrollInterval = 4000
}: ProductCarouselProps) {
  const {
    scrollRef,
    currentIndex,
    setIsPaused,
    scroll
  } = useCarousel({
    autoScroll,
    scrollInterval,
    scrollAmount: 300
  })

  if (products.length === 0) return null

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 px-4 sm:px-0">{title}</h2>
      
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className={cn(
            "absolute left-0 sm:left-0 top-1/2 -translate-y-1/2 z-10",
            "bg-white rounded-full p-1.5 sm:p-2 shadow-lg",
            "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity",
            "hover:bg-gray-50 cursor-pointer",
            "sm:-translate-x-1/2"
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
        </button>

        <button
          onClick={() => scroll('right')}
          className={cn(
            "absolute right-0 sm:right-0 top-1/2 -translate-y-1/2 z-10",
            "bg-white rounded-full p-1.5 sm:p-2 shadow-lg",
            "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity",
            "hover:bg-gray-50 cursor-pointer",
            "sm:translate-x-1/2"
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 px-4 sm:px-0"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none'
          }}
        >
          {[...products, ...products].map((product, index) => (
            <div 
              key={`${product.id}-${index}`} 
              className="flex-none w-64 sm:w-72"
            >
              <Suspense fallback={<div className="h-full bg-gray-100 animate-pulse rounded-lg" />}>
                <ProductCard product={product} />
              </Suspense>
            </div>
          ))}
        </div>

        {autoScroll && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (scrollRef.current) {
                    scrollRef.current.scrollTo({
                      left: i * 300,
                      behavior: 'smooth'
                    })
                  }
                }}
                className={cn(
                  "h-2 w-2 rounded-full transition-all cursor-pointer",
                  currentIndex % products.length === i 
                    ? "bg-blue-600 w-6" 
                    : "bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
