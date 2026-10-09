<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('product_comments')->cascadeOnDelete(); // balasan
            $table->string('user_name', 120);
            $table->string('user_email', 190);
            $table->text('comment_text');
            $table->unsignedTinyInteger('rating')->nullable();      // 1-5 (hanya komentar utama)
            $table->unsignedInteger('upvotes_count')->default(0);
            $table->string('status', 20)->default('approved');      // pending | approved | flagged
            $table->boolean('is_staff')->default(false);            // badge "WartaTekno Staff"
            $table->timestamps();

            $table->index(['product_id', 'status', 'created_at']);
            $table->index('parent_id');
        });

        DB::statement('ALTER TABLE product_comments ADD CONSTRAINT product_comments_rating_check CHECK (rating IS NULL OR rating BETWEEN 1 AND 5)');
    }

    public function down(): void
    {
        Schema::dropIfExists('product_comments');
    }
};
