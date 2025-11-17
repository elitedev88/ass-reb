import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/api/products'
import { ProductDetail } from '@/components/products/ProductDetail'
import { Header } from '@/components/layout/Header'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const product = await getProductById(Number(id))
    return {
      title: `${product.title} | E-commerce Store`,
      description: product.description,
    }
  } catch {
    return {
      title: 'Product Not Found | E-commerce Store',
      description: 'The product you are looking for does not exist.',
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  try {
    const product = await getProductById(Number(id))
    
    return (
      <>
        <Header title={product.title} />
        <main className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
            <ProductDetail product={product} />
          </div>
        </main>
      </>
    )
  } catch (error) {
    notFound()
  }
}
