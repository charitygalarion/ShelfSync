<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Borrow;
use App\Models\Penalty;

class UserController extends Controller
{
    /**
     * Get the authenticated user's profile
     */
    public function profile()
    {
        $user = Auth::user();
        return response()->json($user, 200);
    }

    /**
     * Update the authenticated user's profile
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'username' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:6|confirmed',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json(['message' => 'Profile updated successfully', 'user' => $user]);
    }

    /**
     * Get the user's borrowed books
     */
    public function borrowedBooks()
    {
        $user = Auth::user();
        $borrowed = Borrow::with('book')
            ->where('user_id', $user->id)
            ->orderBy('due_date', 'asc')
            ->get();

        return response()->json($borrowed);
    }

    /**
     * Get the user's penalties
     */
    public function penalties()
    {
        $user = Auth::user();
        $penalties = Penalty::where('user_id', $user->id)->get();

        return response()->json($penalties);
    }
}
