import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Category } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDiscount(percentage: number): string {
  return `${Math.round(percentage)}% OFF`
}

export function calculateDiscountedPrice(price: number, discountPercentage: number): number {
  const discount = price * (discountPercentage / 100)
  return Math.round((price - discount) * 100) / 100
}

export function formatCategoryName(category: string): string {
  if (!category) return ''
  
  const specialCases: Record<string, string> = {
    'home-decoration': 'Home Decoration',
    'kitchen-accessories': 'Kitchen Accessories',
    'mens-shirts': "Men's Shirts",
    'mens-shoes': "Men's Shoes",
    'mens-watches': "Men's Watches",
    'mobile-accessories': 'Mobile Accessories',
    'skin-care': 'Skin Care',
    'sports-accessories': 'Sports Accessories',
    'womens-bags': "Women's Bags",
    'womens-dresses': "Women's Dresses",
    'womens-jewellery': "Women's Jewellery",
    'womens-shoes': "Women's Shoes",
    'womens-watches': "Women's Watches"
  }
  
  if (specialCases[category]) {
    return specialCases[category]
  }
  
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function getCategoryDisplayTitle(selectedCategories: string[], categories: Category[] | undefined): string {
  if (selectedCategories.length === 0) return "All Products";
  if (selectedCategories.length === 1) {
    const category = categories?.find((cat) => cat.slug === selectedCategories[0]);
    return category?.name || "Products";
  }
  return `${selectedCategories.length} Categories Selected`;
}
