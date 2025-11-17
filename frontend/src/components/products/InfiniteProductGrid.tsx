"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteProductsMulti, useCategories } from "@/hooks";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Loader2, Package } from "lucide-react";
import { CategoryDropdown } from "./CategoryDropdown";
import { getCategoryDisplayTitle } from "@/lib/utils";

export function InfiniteProductGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const categoriesParam = searchParams.get('categories');
    return categoriesParam ? categoriesParam.split(',') : [];
  });
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteProductsMulti(30, selectedCategories);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentParams = searchParams.get('categories');
    const newCategoriesParam = selectedCategories.length > 0 ? selectedCategories.join(',') : null;
    
    if (currentParams !== newCategoriesParam) {
      const params = new URLSearchParams(searchParams.toString());
      
      if (selectedCategories.length > 0) {
        params.set('categories', selectedCategories.join(','));
      } else {
        params.delete('categories');
      }
      
      const newUrl = params.toString() ? `/products?${params.toString()}` : '/products';
      router.push(newUrl, { scroll: false });
    }
  }, [selectedCategories, router, searchParams]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allProducts = data?.pages.flatMap((page) => page.products) || [];
  const totalProducts = data?.pages[0]?.total || 0;
  const displayTitle = getCategoryDisplayTitle(selectedCategories, categories);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{displayTitle}</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
            {selectedCategories.length === 0
              ? "Browse our extensive collection of products"
              : selectedCategories.length === 1
              ? `Discover our ${displayTitle.toLowerCase()} collection`
              : "Browse products from multiple categories"}
          </p>
        </div>
        <div className="flex justify-start sm:justify-end">
          <CategoryDropdown
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            isLoading={categoriesLoading}
          />
        </div>
      </div>

      {error && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Package className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load products
          </h3>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && allProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Package className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600">Check back later for new products</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {allProducts.length} of {totalProducts} products
              {selectedCategories.length > 0 &&
                categories &&
                (() => {
                  if (selectedCategories.length === 1) {
                    const category = categories.find(
                      (cat) => cat.slug === selectedCategories[0]
                    );
                    return category ? ` in ${category.name}` : "";
                  }
                  return ` in ${selectedCategories.length} categories`;
                })()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div ref={loadMoreRef} className="flex justify-center py-6 sm:py-8">
            {isFetchingNextPage && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span className="text-sm sm:text-base">Loading more products...</span>
              </div>
            )}
            {!hasNextPage && allProducts.length > 0 && (
              <p className="text-gray-500 text-xs sm:text-sm">All products loaded</p>
            )}
          </div>
        </>
      )}
    </>
  );
}
