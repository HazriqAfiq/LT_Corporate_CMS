<?php
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Auto Backup schedule (Daily database backup at 3:00 AM, clean up old backups at 2:30 AM)
Schedule::command('backup:clean')->daily()->at('02:30');
Schedule::command('backup:run --only-db')->daily()->at('03:00');
