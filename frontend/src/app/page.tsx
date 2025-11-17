import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/api/products";
import { ProductCarousel } from "@/components/products/ProductCarousel";

export default async function Home() {
  const featuredProducts = await getProducts(12, 0);
  const topRatedProducts = await getProducts(12, 30);
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Welcome to E-commerce Store
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 px-4 sm:px-0">
              Discover amazing products from top brands at unbeatable prices
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer text-sm sm:text-base"
              >
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                Browse Products
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>

          <div className="mt-24 mb-12">
            <ProductCarousel 
              products={featuredProducts.products} 
              title="Featured Products" 
              autoScroll={true}
              scrollInterval={4000}
            />
          </div>

          <div className="mt-16 mb-12">
            <ProductCarousel 
              products={topRatedProducts.products} 
              title="Top Rated Products" 
              autoScroll={true}
              scrollInterval={4500}
            />
          </div>
        </div>
      </main>
    </>
  );
}