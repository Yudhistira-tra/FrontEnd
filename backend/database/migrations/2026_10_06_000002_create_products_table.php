<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('brand', 100)->nullable();
            $table->string('sku', 100)->nullable()->unique();      // SKU / Kode Model
            $table->text('description')->nullable();
            $table->string('image_url', 500)->nullable();
            $table->unsignedBigInteger('price')->default(0);       // estimasi harga (Rupiah)
            $table->date('release_date')->nullable();
            $table->jsonb('specs_json')->nullable();               // spesifikasi ringkas
            $table->text('editor_note')->nullable();               // "Rekomendasi Editor"
            $table->decimal('editor_score', 3, 1)->nullable();     // 0.0 - 10.0
            $table->string('status', 20)->default('active');       // draft | active | archived
            $table->boolean('is_featured')->default(false);        // banner highlight
            $table->unsignedInteger('views_count')->default(0);
            $table->timestamps();

            $table->index(['status', 'release_date']);
            $table->index('category_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
