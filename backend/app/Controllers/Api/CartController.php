<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class CartController extends ResourceController
{
    use ResponseTrait;

    protected $format = 'json';

    /**
     * Get cart contents
     * GET /api/cart
     */
    public function index()
    {
        return $this->respond($this->getCartResponse());
    }

    /**
     * Add item to cart
     * POST /api/cart/add
     */
    public function add()
    {
        // In a real application, we would process the request data
        // For this mock API, we just return the static cart response
        return $this->respond($this->getCartResponse());
    }

    /**
     * Update cart item quantity
     * PUT /api/cart/update/{id}
     */
    public function update($id = null)
    {
        // In a real application, we would update the specific item
        // For this mock API, we just return the static cart response
        return $this->respond($this->getCartResponse());
    }

    /**
     * Remove item from cart
     * DELETE /api/cart/remove/{id}
     */
    public function remove($id = null)
    {
        // In a real application, we would remove the specific item
        // For this mock API, we just return the static cart response
        return $this->respond($this->getCartResponse());
    }

    /**
     * Get static cart response
     */
    private function getCartResponse()
    {
        return [
            'success' => true,
            'data' => [
                'items' => [
                    [
                        'id' => 1,
                        'productId' => 1,
                        'title' => 'Essence Mascara Lash Princess',
                        'price' => 9.99,
                        'quantity' => 2,
                        'subtotal' => 19.98,
                        'thumbnail' => 'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp'
                    ],
                    [
                        'id' => 2,
                        'productId' => 7,
                        'title' => 'Chanel Coco Noir Eau De',
                        'price' => 129.99,
                        'quantity' => 1,
                        'subtotal' => 129.99,
                        'thumbnail' => 'https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp'
                    ],
                    [
                        'id' => 3,
                        'productId' => 16,
                        'title' => 'Apple',
                        'price' => 1.99,
                        'quantity' => 5,
                        'subtotal' => 9.95,
                        'thumbnail' => 'https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp'
                    ]
                ],
                'summary' => [
                    'subtotal' => 159.92,
                    'tax' => 15.99,
                    'shipping' => 10.00,
                    'total' => 185.91
                ]
            ],
            'message' => 'Cart retrieved successfully'
        ];
    }
}
