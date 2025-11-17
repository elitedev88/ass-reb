<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// API Routes
$routes->group('api', ['namespace' => 'App\Controllers\Api'], function ($routes) {
    $routes->get('cart', 'CartController::index');
    $routes->post('cart/add', 'CartController::add');
    $routes->put('cart/update/(:num)', 'CartController::update/$1');
    $routes->delete('cart/remove/(:num)', 'CartController::remove/$1');
    
    // Handle preflight OPTIONS requests
    $routes->options('cart', 'CartController::index');
    $routes->options('cart/add', 'CartController::index');
    $routes->options('cart/update/(:num)', 'CartController::index');
    $routes->options('cart/remove/(:num)', 'CartController::index');
});
