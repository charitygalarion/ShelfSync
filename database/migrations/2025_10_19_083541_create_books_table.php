<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_books_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('author');
            $table->string('subject');
            $table->text('description');
            $table->string('isbn')->unique();
            $table->integer('total_copies');
            $table->integer('available_copies');
            $table->enum('status', ['available', 'borrowed'])->default('available');
            $table->string('cover')->nullable();
            $table->boolean('is_new')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};