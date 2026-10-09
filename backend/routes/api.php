<?php

use App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SavedProductController;
use Illuminate\Support\Facades\Route;

// Semua route di bawah memakai prefix /api/v1 (lihat bootstrap/app.php)

// ---------- Publik ----------
Route::post('auth/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
Route::post('auth/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

Route::get('categories', [CategoryController::class, 'index']);

Route::get('products', [ProductController::class, 'index']);
Route::get('products/featured', [ProductController::class, 'featured']);
Route::get('products/{product}', [ProductController::class, 'show']);

Route::get('products/{product}/comments', [CommentController::class, 'index']);
Route::post('products/{product}/comments', [CommentController::class, 'store'])->middleware('throttle:10,1');

Route::post('feedback', [FeedbackController::class, 'store'])->middleware('throttle:5,1');

// ---------- Perlu login ----------
Route::middleware('auth:sanctum')->group(function () {
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/logout', [AuthController::class, 'logout']);

    Route::post('comments/{comment}/like', [CommentController::class, 'like']);

    Route::get('me/saved', [SavedProductController::class, 'index']);
    Route::post('me/saved/{product}', [SavedProductController::class, 'store']);
    Route::patch('me/saved/{product}', [SavedProductController::class, 'update']);
    Route::delete('me/saved/{product}', [SavedProductController::class, 'destroy']);

    // ---------- Admin ----------
    Route::middleware('admin')->group(function () {
        Route::get('admin/dashboard', [Admin\DashboardController::class, 'index']);

        Route::get('admin/products', [Admin\ProductController::class, 'index']);
        Route::post('products', [Admin\ProductController::class, 'store']);
        Route::put('products/{product}', [Admin\ProductController::class, 'update'])->whereNumber('product');
        Route::delete('products/{product}', [Admin\ProductController::class, 'destroy'])->whereNumber('product');

        Route::get('admin/comments', [Admin\CommentModerationController::class, 'index']);
        Route::patch('admin/comments/{comment}', [Admin\CommentModerationController::class, 'updateStatus']);
        Route::delete('admin/comments/{comment}', [Admin\CommentModerationController::class, 'destroy']);

        Route::get('admin/feedbacks', [Admin\FeedbackController::class, 'index']);
        Route::patch('admin/feedbacks/{feedback}', [Admin\FeedbackController::class, 'updateStatus']);
        Route::delete('admin/feedbacks/{feedback}', [Admin\FeedbackController::class, 'destroy']);
    });
});
