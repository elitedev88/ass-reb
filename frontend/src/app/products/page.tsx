import { Metadata } from 'next'
import { Suspense } from 'react'
import { InfiniteProductGrid } from '@/components/products/InfiniteProductGrid'
import { Header } from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'Products | E-commerce Store',
  description: 'Browse our collection of products',
}

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <Suspense fallback={null}>
            <InfiniteProductGrid />
          </Suspense>
        </div>
      </main>
    </>
  )
}
