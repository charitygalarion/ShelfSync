<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_borrowed_books_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('borrowed_books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->date('borrow_date');
            $table->date('due_date');
            $table->date('return_date')->nullable();
            $table->enum('status', ['borrowing', 'returned', 'overdue'])->default('borrowing');
            $table->timestamps();
            
            $table->index(['user_id', 'book_id']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('borrowed_books');
    }
};