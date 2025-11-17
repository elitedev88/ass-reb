import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { getProducts, getProductById, searchProducts, getProductsByCategory, getCategories } from '@/lib/api'
import { ProductsResponse, Product, Category } from '@/types'

export function useProducts(limit: number = 30, skip: number = 0) {
  return useQuery<ProductsResponse, Error>({
    queryKey: ['products', { limit, skip }],
    queryFn: () => getProducts(limit, skip),
    staleTime: 5 * 60 * 1000,
  })
}

export function useProduct(id: number) {
  return useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
  })
}

export function useProductSearch(query: string) {
  return useQuery<ProductsResponse, Error>({
    queryKey: ['products', 'search', query],
    queryFn: () => searchProducts(query),
    staleTime: 5 * 60 * 1000,
    enabled: query.length >= 2,
  })
}

export function useProductsByCategory(category: string) {
  return useQuery<ProductsResponse, Error>({
    queryKey: ['products', 'category', category],
    queryFn: () => getProductsByCategory(category),
    staleTime: 5 * 60 * 1000,
    enabled: !!category,
  })
}

export function useInfiniteProducts(limit: number = 30, category?: string) {
  return useInfiniteQuery<ProductsResponse, Error>({
    queryKey: ['products', 'infinite', { limit, category }],
    queryFn: async ({ pageParam }) => {
      if (category && category !== 'all') {
        const response = await getProductsByCategory(category)
        const start = pageParam as number
        const end = start + limit
        return {
          ...response,
          products: response.products.slice(start, end),
          skip: start,
          limit: limit
        }
      }
      return getProducts(limit, pageParam as number)
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((total, page) => total + page.products.length, 0)
      return loadedCount < lastPage.total ? loadedCount : undefined
    },
    staleTime: 5 * 60 * 1000,
    initialPageParam: 0,
  })
}

export function useInfiniteProductsMulti(limit: number = 30, categories: string[]) {
  return useInfiniteQuery<ProductsResponse, Error>({
    queryKey: ['products', 'infinite-multi', { limit, categories }],
    queryFn: async ({ pageParam }) => {
      const skip = pageParam as number
      
      if (categories.length === 0) {
        return getProducts(limit, skip)
      }
      
      if (categories.length === 1) {
        const category = categories[0]!
        const response = await getProductsByCategory(category)
        const end = skip + limit
        return {
          ...response,
          products: response.products.slice(skip, end),
          skip: skip,
          limit: limit
        }
      }
      
      const allProducts: Product[] = []
      for (const category of categories) {
        const response = await getProductsByCategory(category)
        allProducts.push(...response.products)
      }
      
      const uniqueProducts = Array.from(
        new Map(allProducts.map(item => [item.id, item])).values()
      )
      
      const end = skip + limit
      return {
        products: uniqueProducts.slice(skip, end),
        total: uniqueProducts.length,
        skip: skip,
        limit: limit
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((total, page) => total + page.products.length, 0)
      return loadedCount < lastPage.total ? loadedCount : undefined
    },
    staleTime: 5 * 60 * 1000,
    initialPageParam: 0,
  })
}

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
  })
}
