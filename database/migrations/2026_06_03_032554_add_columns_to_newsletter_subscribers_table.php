<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            if (!Schema::hasColumn('newsletter_subscribers', 'email')) {
                $table->string('email')->unique()->after('id');
            }
            if (!Schema::hasColumn('newsletter_subscribers', 'name')) {
                $table->string('name')->nullable()->after('email');
            }
            if (!Schema::hasColumn('newsletter_subscribers', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('name');
            }
            if (!Schema::hasColumn('newsletter_subscribers', 'subscribed_at')) {
                $table->timestamp('subscribed_at')->nullable()->after('is_active');
            }
            if (!Schema::hasColumn('newsletter_subscribers', 'unsubscribed_at')) {
                $table->timestamp('unsubscribed_at')->nullable()->after('subscribed_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->dropColumn(['email', 'name', 'is_active', 'subscribed_at', 'unsubscribed_at']);
        });
    }
};

