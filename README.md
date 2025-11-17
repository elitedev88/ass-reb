## E-commerce Technical Assessment

A modern e-commerce application built with Next.js 16 (App Router) and CodeIgniter 4, demonstrating TypeScript, state management, and UI/UX best practices.

> Note: The frontend dev server uses `next dev --webpack` due to Turbopack issues.

## Project Overview

This solution implements a full featured e-commerce interface with:
- **Product Browsing**: server-side rendered product listing and detail pages
- **Shopping Cart**: advanced cart management with optimistic updates
- **Type Safety**: comprehensive TypeScript implementation
- **Modern UI**: mobile-first responsive design with shadcn/ui components
- **Mock API**: CodeIgniter 4 backend simulating cart operations
- **Latest Stack**: Next.js 16, React 19, and TypeScript with strict mode

## Project Structure

```
├── frontend/          # Next.js frontend
│   └── src/           # App router, components, hooks, lib, types, contexts
└── backend/           # CodeIgniter 4 mock API
    └── app/           # Controllers, config, filters
```

### 1. Setup

**Prerequisites**
- Node.js 20+ and npm
- PHP 8.1+ and Composer

**Install and run**

```bash
git clone <repository-url>

# Frontend
cd frontend
npm install
npm run dev    # http://localhost:3000

# Backend (optional, mock API)
cd ../backend
composer update
cp env .env
php spark serve    # http://localhost:8080
```

### 2. Features

- **Products**
  - Product listing backed by DummyJSON with infinite scrolling
  - Product detail page with image gallery (thumbnails)
  - Homepage product carousels with auto-scroll, infinite looping, and arrow navigation
  - Category filtering via multi-select dropdown with URL query persistence and dynamic page title

- **Cart**
  - Add/remove items and update quantity with optimistic updates
  - Cart persisted in `localStorage`
  - Discount-aware pricing (discounted price, original price, discount badge)
  - Cart drawer UI and a non-functional checkout button

- **UX / UI**
  - Responsive layout (header, grids, carousels, detail page, cart)
  - Toast notifications for key cart actions
  - Loading skeletons and basic error boundary

- **Technical**
  - Next.js App Router with server components for product pages
  - React Context + `useReducer` for cart state
  - React Query for data fetching
  - Tailwind CSS and shadcn/ui for styling
  - CodeIgniter 4 mock API with CORS configured and static responses 

### 3. API Contract (Backend)

Cart endpoints exposed by the mock API:

```text
GET    /api/cart              # Get cart contents
POST   /api/cart/add          # Add item to cart
PUT    /api/cart/update/{id}  # Update item quantity
DELETE /api/cart/remove/{id}  # Remove item from cart
```

## License
Built by Daniel Shi