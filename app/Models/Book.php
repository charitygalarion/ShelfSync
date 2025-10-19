<?php
// app/Models/Book.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'subject',
        'description',
        'isbn',
        'total_copies',
        'available_copies',
        'status',
        'cover',
        'is_new'
    ];

    protected $casts = [
        'is_new' => 'boolean'
    ];

    public function borrowedBooks()
    {
        return $this->hasMany(BorrowedBook::class);
    }

    public function penalties()
    {
        return $this->hasMany(Penalty::class);
    }
}