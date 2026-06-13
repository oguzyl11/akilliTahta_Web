<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\BookController;
use App\Http\Controllers\Api\V1\WebhookController;

Route::get('/health', function () {
    return response()->json(['status' => 'healthy']);
});

// Webhook (Auth gerektirmeyen iç ağ veya token korumalı dış uç)
// Not: Gerçek senaryoda bu ucu bir "Secret Key" ile korumalıyız. Şimdilik açık.
Route::post('/v1/webhooks/pdf-processed', [WebhookController::class, 'pdfProcessed']);

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        // Public routes
        Route::post('/login', [AuthController::class, 'login']);
    });
});

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Institution routes (Sadece Admin ve Institution Admin)
    // Şimdilik middleware 'role:INSTITUTION_ADMIN' yazmıyoruz, daha sonra Spatie eklenecek.
    Route::apiResource('users', UserController::class);

    // Book Management
    Route::post('/books/upload', [BookController::class, 'upload']);
});
