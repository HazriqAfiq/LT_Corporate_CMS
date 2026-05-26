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
        Schema::table('media', function (Blueprint $table) {
            $table->uuid('uuid')->after('id')->unique();
            $table->string('type')->after('mime_type')->nullable(); // image, video, document
            $table->string('extension')->after('type')->nullable();
            $table->integer('duration')->after('size')->nullable(); // for video/audio
            $table->string('caption')->after('title')->nullable();
            $table->text('description')->after('caption')->nullable();
            $table->boolean('is_public')->after('uploaded_by')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('media', function (Blueprint $table) {
            $table->dropColumn([
                'uuid',
                'type',
                'extension',
                'duration',
                'caption',
                'description',
                'is_public'
            ]);
        });
    }
};
