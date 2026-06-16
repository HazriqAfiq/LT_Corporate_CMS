<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class SystemInfoController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:access_system_info'),
        ];
    }
    public function index()
    {
        // --- Core versions ---
        $phpVersion     = PHP_VERSION;
        $laravelVersion = app()->version();
        $dbVersion      = $this->getDatabaseVersion();
        $webServer      = $_SERVER['SERVER_SOFTWARE'] ?? php_uname('s') . ' ' . php_uname('r');

        // --- Health checks ---
        $health = [
            'database' => $this->checkDatabase(),
            'cache'    => $this->checkCache(),
            'storage'  => $this->checkStorage(),
            'debug'    => !config('app.debug'),
            'mail'     => !empty(config('mail.mailers.smtp.host')),
            'queue'    => config('queue.default', 'sync'),
        ];

        // --- Storage usage ---
        $storage = $this->getStorageInfo();

        // --- Server info ---
        $serverInfo = [
            'environment'      => config('app.env'),
            'app_url'          => config('app.url'),
            'timezone'         => config('app.timezone'),
            'max_upload'       => ini_get('upload_max_filesize'),
            'max_exec_time'    => ini_get('max_execution_time') . 's',
            'memory_limit'     => ini_get('memory_limit'),
            'php_extensions'   => implode(', ', array_filter(
                ['pdo', 'mbstring', 'openssl', 'tokenizer', 'xml', 'ctype', 'json', 'gd', 'fileinfo', 'zip'],
                fn($ext) => extension_loaded($ext)
            )),
            'os'               => php_uname('s') . ' ' . php_uname('r') . ' ' . php_uname('m'),
        ];

        return Inertia::render('Admin/SystemInfo/Index', [
            'systemInfo' => [
                'php_version'     => $phpVersion,
                'laravel_version' => $laravelVersion,
                'db_version'      => $dbVersion,
                'web_server'      => $webServer,
                'health'          => $health,
                'storage'         => $storage,
                'server'          => $serverInfo,
            ],
        ]);
    }

    private function getDatabaseVersion(): string
    {
        try {
            $driver = DB::connection()->getDriverName();
            if ($driver === 'mysql') {
                $result = DB::selectOne('SELECT VERSION() as version');
                return 'MySQL ' . ($result->version ?? 'N/A');
            }
            if ($driver === 'pgsql') {
                $result = DB::selectOne('SELECT version()');
                preg_match('/PostgreSQL ([\d.]+)/', $result->version ?? '', $m);
                return 'PostgreSQL ' . ($m[1] ?? 'N/A');
            }
            if ($driver === 'sqlite') {
                return 'SQLite ' . DB::selectOne('SELECT sqlite_version() as v')->v;
            }
            return ucfirst($driver);
        } catch (\Throwable $e) {
            return 'Unknown';
        }
    }

    private function checkDatabase(): array
    {
        try {
            DB::connection()->getPdo();
            return ['status' => true, 'detail' => 'Connected successfully'];
        } catch (\Throwable $e) {
            return ['status' => false, 'detail' => $e->getMessage()];
        }
    }

    private function checkCache(): array
    {
        try {
            cache()->put('__sys_health_check', 1, 5);
            $ok = cache()->get('__sys_health_check') === 1;
            cache()->forget('__sys_health_check');
            $driver = config('cache.default', 'file');
            return ['status' => $ok, 'detail' => ucfirst($driver) . ' cache active'];
        } catch (\Throwable $e) {
            return ['status' => false, 'detail' => $e->getMessage()];
        }
    }

    private function checkStorage(): array
    {
        $path = storage_path('app');
        $ok   = is_writable($path);
        return ['status' => $ok, 'detail' => $ok ? 'storage/app is writable' : 'storage/app not writable'];
    }

    private function getStorageInfo(): array
    {
        $items = [];

        // Media uploads (public disk)
        $publicPath = storage_path('app/public');
        $items[] = [
            'label' => 'Media Uploads',
            'used'  => $this->formatBytes($this->directorySize($publicPath)),
            'color' => 'from-[var(--gold)] to-amber-500',
            'bytes' => $this->directorySize($publicPath),
        ];

        // Backup files
        $backupName = config('backup.backup.name', config('app.name', 'laravel-backup'));
        $backupPath = storage_path('app/' . $backupName);
        $items[] = [
            'label' => 'Backup Files',
            'used'  => $this->formatBytes($this->directorySize($backupPath)),
            'color' => 'from-sky-500 to-blue-600',
            'bytes' => $this->directorySize($backupPath),
        ];

        // Total disk info
        $totalDisk = disk_total_space(storage_path('app')) ?: 0;
        $freeDisk  = disk_free_space(storage_path('app')) ?: 0;
        $usedDisk  = $totalDisk - $freeDisk;

        return [
            'items'      => $items,
            'disk_total' => $this->formatBytes($totalDisk),
            'disk_used'  => $this->formatBytes($usedDisk),
            'disk_pct'   => $totalDisk > 0 ? round(($usedDisk / $totalDisk) * 100, 1) : 0,
        ];
    }

    private function directorySize(string $path): int
    {
        if (!is_dir($path)) return 0;
        $size = 0;
        try {
            foreach (new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($path, \FilesystemIterator::SKIP_DOTS)) as $file) {
                $size += $file->getSize();
            }
        } catch (\Throwable $e) {
            // ignore unreadable dirs
        }
        return $size;
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes >= 1073741824) return round($bytes / 1073741824, 2) . ' GB';
        if ($bytes >= 1048576)    return round($bytes / 1048576, 2) . ' MB';
        if ($bytes >= 1024)       return round($bytes / 1024, 2) . ' KB';
        return $bytes . ' B';
    }
}
