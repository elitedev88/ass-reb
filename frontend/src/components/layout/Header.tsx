'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '@/hooks'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  const { getTotalItems, openCart } = useCart()
  const itemCount = getTotalItems()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden items-center p-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link 
            href="/" 
            className="flex items-center space-x-2 text-lg sm:text-xl font-bold text-gray-900 hover:text-gray-700 cursor-pointer"
          >
            <span>E-Store</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {title ? (
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            ) : (
              <Link 
                href="/products" 
                className="text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
              >
                Products
              </Link>
            )}
          </nav>

          <button
            onClick={openCart}
            className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
            {itemCount > 0 && (
              <span 
                className={cn(
                  "absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-600 text-xs text-white",
                  "flex items-center justify-center font-medium"
                )}
              >
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="space-y-2">
              <Link 
                href="/products" 
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Products
              </Link>
              {title && (
                <div className="px-4 py-2 text-sm font-semibold text-gray-900">
                  Current: {title}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
