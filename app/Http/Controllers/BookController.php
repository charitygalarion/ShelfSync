<?php
// app/Http/Controllers/BookController.php
namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::query();

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%")
                  ->orWhere('isbn', 'like', "%{$search}%");
            });
        }

        if ($request->has('subject') && $request->subject) {
            $query->where('subject', $request->subject);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'isbn' => 'required|string|unique:books',
            'total_copies' => 'required|integer|min:1',
            'cover' => 'nullable|string',
            'is_new' => 'boolean'
        ]);

        $book = Book::create([
            ...$validated,
            'available_copies' => $validated['total_copies'],
            'status' => 'available'
        ]);

        return response()->json($book, 201);
    }

    public function update(Request $request, Book $book)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'isbn' => 'required|string|unique:books,isbn,' . $book->id,
            'total_copies' => 'required|integer|min:1',
            'cover' => 'nullable|string',
            'is_new' => 'boolean'
        ]);

        // Calculate new available copies
        $borrowedCount = $book->borrowedBooks()->whereIn('status', ['borrowing', 'overdue'])->count();
        $newAvailableCopies = max(0, $validated['total_copies'] - $borrowedCount);

        $book->update([
            ...$validated,
            'available_copies' => $newAvailableCopies,
            'status' => $newAvailableCopies > 0 ? 'available' : 'borrowed'
        ]);

        return response()->json($book);
    }

    public function destroy(Book $book)
    {
        // Check if book is currently borrowed
        if ($book->borrowedBooks()->whereIn('status', ['borrowing', 'overdue'])->exists()) {
            return response()->json(['error' => 'Cannot delete book that is currently borrowed'], 400);
        }

        $book->delete();
        return response()->json(['message' => 'Book deleted successfully']);
    }
}