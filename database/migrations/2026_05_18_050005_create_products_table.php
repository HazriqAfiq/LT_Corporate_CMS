<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('name_en')->nullable();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('description_en')->nullable();
            $table->longText('content')->nullable();
            $table->longText('content_en')->nullable();
            $table->string('icon')->nullable();
            $table->string('featured_image')->nullable();
            $table->json('features')->nullable();
            $table->json('features_en')->nullable();
            $table->string('price')->nullable();
            $table->string('demo_url')->nullable();
            $table->string('category')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('order')->default(0);
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
