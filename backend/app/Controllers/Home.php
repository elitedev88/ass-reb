<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index(): string
    {
        return json_encode([
            'success' => true,
            'message' => 'Mock Cart API is running',
            'endpoints' => [
                'GET /api/cart' => 'Get cart contents',
                'POST /api/cart/add' => 'Add item to cart',
                'PUT /api/cart/update/{id}' => 'Update cart item quantity',
                'DELETE /api/cart/remove/{id}' => 'Remove item from cart'
            ]
        ]);
    }
}
