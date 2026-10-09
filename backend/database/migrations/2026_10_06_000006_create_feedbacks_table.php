<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name', 120);
            $table->string('email', 190);
            $table->string('category', 30);                    // product_request | bug_report | feature_suggestion | general
            $table->text('message');
            $table->unsignedTinyInteger('rating')->nullable(); // 1-5
            $table->string('status', 20)->default('new');      // new | read | resolved
            $table->timestamps();

            $table->index(['status', 'category']);
        });

        DB::statement('ALTER TABLE feedbacks ADD CONSTRAINT feedbacks_rating_check CHECK (rating IS NULL OR rating BETWEEN 1 AND 5)');
    }

    public function down(): void
    {
        Schema::dropIfExists('feedbacks');
    }
};
