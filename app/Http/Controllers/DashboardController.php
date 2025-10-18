<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Borrow;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function adminStats()
    {
        return response()->json([
            'total_books' => Book::count(),
            'available_books' => Book::sum('available'),
            'borrowed_books' => Borrow::where('status','borrowed')->count(),
            'overdue_books' => Borrow::whereNull('return_date')->where('due_date','<',now())->count(),
            'new_arrivals' => Book::where('is_new_arrival',true)->count(),
            'total_users' => User::count(),
        ]);
    }

    public function userStats()
    {
        $user = Auth::user();
        return response()->json([
            'my_borrows' => $user->borrows()->with('book')->get(),
            'new_arrivals' => Book::where('is_new_arrival',true)->get(),
        ]);
    }
}
