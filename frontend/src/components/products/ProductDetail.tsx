'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, ShoppingCart, Check, Package, Shield, Truck, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Product } from '@/types'
import { cn, formatCurrency, formatDiscount, calculateDiscountedPrice, formatCategoryName } from '@/lib/utils'
import { useCart } from '@/hooks'

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { addItem, openCart } = useCart()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  
  const discountedPrice = product.discountPercentage > 0 
    ? calculateDiscountedPrice(product.price, product.discountPercentage)
    : product.price

  const handleAddToCart = async () => {
    setIsAdding(true)
    addItem(product)
    toast.success(`${product.title} added to cart!`, {
      description: `Price: ${formatCurrency(discountedPrice)}`,
      action: {
        label: 'View Cart',
        onClick: () => openCart(),
      },
    })
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:gap-8 lg:grid-cols-2">
      <div className="space-y-3 sm:space-y-4">
        <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 group">
          <Image
            src={product.images[selectedImage] || product.thumbnail}
            alt={product.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
          />
          
          {product.images.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
              </button>
              <button
                onClick={() => setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
              </button>
            </>
          )}
        </div>
        
        {product.images.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "aspect-square relative overflow-hidden rounded-md bg-gray-100 border-2 cursor-pointer transition-all hover:opacity-80",
                  selectedImage === index ? "border-blue-600" : "border-gray-200 hover:border-gray-300"
                )}
              >
                <Image
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 25vw, 12.5vw"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="text-xs sm:text-sm text-gray-500 truncate">
          Home / {formatCategoryName(product.category)} / <span className="hidden sm:inline">{product.title}</span>
        </div>

        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 cursor-pointer group"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base font-medium">Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.title}</h1>
          {product.brand && <p className="mt-1 text-base sm:text-lg text-gray-600">by {product.brand}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5",
                  i < Math.round(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                )}
              />
            ))}
          </div>
          <span className="text-sm sm:text-base text-gray-600">{product.rating.toFixed(1)}</span>
          <span className="text-gray-400">•</span>
          <span className="text-sm sm:text-base text-gray-600">{product.reviews?.length || 0} reviews</span>
        </div>

        <div className="space-y-2">
          {product.discountPercentage > 0 ? (
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                {formatCurrency(discountedPrice)}
              </span>
              <span className="text-lg sm:text-xl text-gray-500 line-through">
                {formatCurrency(product.price)}
              </span>
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs sm:text-sm font-semibold">
                {formatDiscount(product.discountPercentage)}
              </span>
            </div>
          ) : (
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {product.stock > 0 ? (
            <>
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-green-600 font-medium">
                In Stock ({product.stock} available)
              </span>
            </>
          ) : (
            <span className="text-red-600 font-medium">Out of Stock</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all cursor-pointer",
            product.stock > 0
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed",
            isAdding && "bg-green-600 hover:bg-green-600"
          )}
        >
          {isAdding ? (
            <>
              <Check className="h-5 w-5" />
              Added to Cart!
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </>
          )}
        </button>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t">
          <div className="text-center">
            <Truck className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-gray-400 mb-1" />
            <p className="text-xs sm:text-sm text-gray-600">{product.shippingInformation}</p>
          </div>
          <div className="text-center">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-gray-400 mb-1" />
            <p className="text-xs sm:text-sm text-gray-600">{product.warrantyInformation}</p>
          </div>
          <div className="text-center">
            <Package className="h-5 w-5 sm:h-6 sm:w-6 mx-auto text-gray-400 mb-1" />
            <p className="text-xs sm:text-sm text-gray-600">{product.returnPolicy}</p>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 pt-4 border-t">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Description</h2>
          <p className="text-sm sm:text-base text-gray-600">{product.description}</p>
        </div>

        <div className="space-y-3 sm:space-y-4 pt-4 border-t">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Product Details</h2>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-gray-600">SKU</dt>
              <dd className="text-gray-900">{product.sku}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Category</dt>
              <dd className="text-gray-900 capitalize">{product.category}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Tags</dt>
              <dd className="text-gray-900">{product.tags.join(', ')}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Weight</dt>
              <dd className="text-gray-900">{product.weight} oz</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Dimensions</dt>
              <dd className="text-gray-900">
                {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
