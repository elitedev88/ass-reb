'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  ChevronDown, 
  Package,
  Sparkles,
  Home,
  ShoppingCart,
  Sofa,
  Laptop,
  Shirt,
  Footprints,
  Watch,
  Smartphone,
  Bike,
  Heart,
  Phone,
  Dumbbell,
  Glasses,
  Tablet,
  Car,
  ShoppingBag,
  Crown,
  Gem,
  Grid3x3,
  Check
} from 'lucide-react'
import { cn, getCategoryDisplayTitle } from '@/lib/utils'
import { Category } from '@/types'

interface CategoryDropdownProps {
  categories: Category[] | undefined
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  isLoading: boolean
}

const categoryIcons: Record<string, any> = {
  'all': Grid3x3,
  'beauty': Sparkles,
  'fragrances': Heart,
  'furniture': Sofa,
  'groceries': ShoppingCart,
  'home-decoration': Home,
  'kitchen-accessories': ShoppingCart,
  'laptops': Laptop,
  'mens-shirts': Shirt,
  'mens-shoes': Footprints,
  'mens-watches': Watch,
  'mobile-accessories': Phone,
  'motorcycle': Bike,
  'skin-care': Heart,
  'smartphones': Smartphone,
  'sports-accessories': Dumbbell,
  'sunglasses': Glasses,
  'tablets': Tablet,
  'tops': Shirt,
  'vehicle': Car,
  'womens-bags': ShoppingBag,
  'womens-dresses': Crown,
  'womens-jewellery': Gem,
  'womens-shoes': Footprints,
  'womens-watches': Watch,
}

export function CategoryDropdown({ 
  categories, 
  selectedCategories, 
  onCategoryChange, 
  isLoading 
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleCategory = (slug: string) => {
    if (slug === 'all') {
      onCategoryChange([])
    } else {
      const newCategories = selectedCategories.includes(slug)
        ? selectedCategories.filter(cat => cat !== slug)
        : [...selectedCategories, slug]
      onCategoryChange(newCategories)
    }
  }

  const getIcon = (slug: string) => {
    const Icon = categoryIcons[slug] || Package
    return <Icon className="h-4 w-4" />
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 bg-white border rounded-lg",
          "text-sm font-medium transition-all cursor-pointer",
          "hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",
          isOpen ? "border-blue-500" : "border-gray-200"
        )}
        disabled={isLoading}
      >
        {selectedCategories.length === 0 
          ? getIcon('all') 
          : selectedCategories.length === 1 
          ? getIcon(selectedCategories[0] || 'all')
          : <Grid3x3 className="h-4 w-4" />
        }
        <span className="mr-2">{getCategoryDisplayTitle(selectedCategories, categories)}</span>
        <ChevronDown 
          className={cn(
            "h-4 w-4 transition-transform",
            isOpen && "rotate-180"
          )} 
        />
        </button>

        {isOpen && (
          <div className="absolute z-50 right-0 mt-1 w-56 sm:w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <button
                onClick={() => {
                  toggleCategory('all')
                  if (selectedCategories.length === 0) {
                    setIsOpen(false)
                  }
                }}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm transition-colors cursor-pointer flex items-center justify-between",
                  selectedCategories.length === 0
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-3">
                  {getIcon('all')}
                  <span>All Products</span>
                </div>
                {selectedCategories.length === 0 && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>
              
              {selectedCategories.length > 0 && (
                <div className="border-t border-gray-200 my-1" />
              )}
              
              {selectedCategories.length > 1 && (
                <button
                  onClick={() => {
                    onCategoryChange([])
                  }}
                  className="w-full px-4 py-2 text-left text-sm transition-colors cursor-pointer hover:bg-gray-50 text-red-600 font-medium"
                >
                  Clear Selection
                </button>
              )}
              
              {categories?.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => {
                    toggleCategory(category.slug)
                  }}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm transition-colors cursor-pointer flex items-center justify-between",
                    selectedCategories.includes(category.slug)
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {getIcon(category.slug)}
                    <span>{category.name}</span>
                  </div>
                  {selectedCategories.includes(category.slug) && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              ))}
              
              {selectedCategories.length > 0 && (
                <>
                  <div className="border-t border-gray-200 my-1" />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
  )
}
