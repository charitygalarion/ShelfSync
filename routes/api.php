<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\BorrowController;
use App\Http\Controllers\PenaltyController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Books
    Route::get('/books', [BookController::class, 'index']);
    Route::post('/books', [BookController::class, 'store']);
    Route::put('/books/{book}', [BookController::class, 'update']);
    Route::delete('/books/{book}', [BookController::class, 'destroy']);

    // Borrow
    Route::get('/borrowed-books', [BorrowController::class, 'index']);
    Route::post('/borrow', [BorrowController::class, 'store']);
    Route::post('/return-book/{borrowedBook}', [BorrowController::class, 'returnBook']);
    Route::put('/update-due-date/{borrowedBook}', [BorrowController::class, 'updateDueDate']);

    // Penalties
    Route::get('/penalties', [PenaltyController::class, 'index']);
    Route::post('/penalties/{penalty}/mark-paid', [PenaltyController::class, 'markAsPaid']);

    // Announcements
    Route::get('/announcements', [AnnouncementController::class, 'index']);
    Route::post('/announcements', [AnnouncementController::class, 'store']);
    Route::put('/announcements/{announcement}', [AnnouncementController::class, 'update']);
    Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy']);

    // Admin only routes
    Route::middleware('admin')->group(function () {
        Route::get('/admin/stats', [DashboardController::class, 'adminStats']);
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users/{user}/toggle-status', [UserController::class, 'toggleStatus']);
    });
});