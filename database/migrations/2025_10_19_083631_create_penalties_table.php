<?php
// database/migrations/xxxx_xx_xx_xxxxxx_create_penalties_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('penalties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->string('reason');
            $table->decimal('amount', 8, 2);
            $table->enum('status', ['unpaid', 'paid'])->default('unpaid');
            $table->date('due_date');
            $table->timestamps();
            
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penalties');
    }
};