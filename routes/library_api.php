<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\BorrowController;
use App\Http\Controllers\Api\PenaltyController;
use App\Http\Controllers\Api\DashboardController;

Route::post('register',[AuthController::class,'register']);
Route::post('login',[AuthController::class,'login']);

Route::middleware('auth:sanctum')->group(function(){
    Route::post('logout',[AuthController::class,'logout']);
    Route::get('dashboard/admin',[DashboardController::class,'adminStats']);
    Route::get('dashboard/user',[DashboardController::class,'userStats']);
    Route::apiResource('books',BookController::class);
    Route::get('books-new-arrivals',[BookController::class,'newArrivals']);
    Route::get('borrows/my',[BorrowController::class,'myBorrows']);
    Route::post('borrows',[BorrowController::class,'store']);
    Route::post('borrows/{borrow}/return',[BorrowController::class,'returnBook']);
    Route::get('borrows',[BorrowController::class,'index']);
    Route::get('penalties/my',[PenaltyController::class,'myPenalties']);
    Route::post('penalties/{penalty}/pay',[PenaltyController::class,'pay']);
    Route::get('penalties',[PenaltyController::class,'index']);
});
