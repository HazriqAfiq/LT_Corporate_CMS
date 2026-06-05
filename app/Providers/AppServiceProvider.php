<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        \Illuminate\Support\Facades\Gate::before(function ($user, $ability) {
            return $user->hasRole('Super Admin') ? true : null;
        });

        Event::listen(\Spatie\Backup\Events\BackupWasSuccessful::class, function () {
            \App\Models\Setting::updateOrCreate(
                ['key' => 'latest_backup_timestamp'],
                [
                    'value' => now()->timestamp,
                    'type' => 'text'
                ]
            );
        });
    }
}
