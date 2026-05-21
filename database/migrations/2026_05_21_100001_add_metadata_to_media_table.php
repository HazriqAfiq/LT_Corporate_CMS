<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('media', function (Blueprint $table) {
            $table->string('folder')->nullable()->after('collection');
            $table->unsignedInteger('width')->nullable()->after('folder');
            $table->unsignedInteger('height')->nullable()->after('width');
            $table->string('thumbnail_path')->nullable()->after('height');
        });
    }

    public function down(): void
    {
        Schema::table('media', function (Blueprint $table) {
            $table->dropColumn(['folder', 'width', 'height', 'thumbnail_path']);
        });
    }
};
