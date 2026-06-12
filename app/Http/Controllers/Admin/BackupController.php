<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class BackupController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:access_backup'),
        ];
    }
    /**
     * The local disk path where spatie/laravel-backup stores files.
     */
    private function backupDisk(): \Illuminate\Contracts\Filesystem\Filesystem
    {
        return Storage::disk('local');
    }

    private function backupDirectory(): string
    {
        return config('backup.backup.name', config('app.name', 'laravel-backup'));
    }

    public function index(Request $request)
    {
        // Update the user's last_viewed_backups_at timestamp
        if ($user = $request->user()) {
            $user->update(['last_viewed_backups_at' => now()]);
        }
        $disk      = $this->backupDisk();
        $directory = $this->backupDirectory();
        $files     = [];

        if ($disk->exists($directory)) {
            $rawFiles = $disk->files($directory);

            foreach ($rawFiles as $filePath) {
                $name     = basename($filePath);
                $size     = $disk->size($filePath);
                $modified = $disk->lastModified($filePath);

                $files[] = [
                    'name'      => $name,
                    'path'      => $filePath,
                    'size'      => $this->formatBytes($size),
                    'size_raw'  => $size,
                    'date'      => date('Y-m-d H:i:s', $modified),
                    'timestamp' => $modified,
                ];
            }

            usort($files, fn($a, $b) => $b['timestamp'] - $a['timestamp']);
        }

        // Calculate total storage used
        $totalBytes   = array_sum(array_column($files, 'size_raw'));
        $storageLimit = 1024 * 1024 * 1024; // 1 GB

        return Inertia::render('Admin/Backup/Index', [
            'backups'      => $files,
            'storageUsed'  => $this->formatBytes($totalBytes),
            'storageRaw'   => $totalBytes,
            'storageLimit' => $storageLimit,
            'storagePct'   => $storageLimit > 0 ? round(($totalBytes / $storageLimit) * 100, 2) : 0,
        ]);
    }

    public function run()
    {
        try {
            putenv('MANUAL_BACKUP=true');
            $command = '"' . PHP_BINARY . '" "' . base_path('artisan') . '" backup:run --only-db 2>&1';
            $output  = shell_exec($command);

            if (str_contains($output, 'Backup completed!') || str_contains($output, 'Successfully copied zip')) {
                ActivityLogger::log('backup', 'Backup pangkalan data berjaya dijalankan.');
                return response()->json(['success' => true, 'message' => 'Backup berjaya dijalankan.']);
            }

            ActivityLogger::log('backup', 'Backup pangkalan data gagal.');
            return response()->json(['success' => false, 'message' => 'Backup gagal. ' . $output], 500);
        } catch (\Throwable $e) {
            ActivityLogger::log('backup', 'Backup pangkalan data gagal: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function download(string $filename): StreamedResponse
    {
        $disk      = $this->backupDisk();
        $filePath  = $this->backupDirectory() . '/' . $filename;

        abort_if(!$disk->exists($filePath), 404, 'Fail tidak dijumpai.');

        return $disk->download($filePath, $filename);
    }

    public function delete(string $filename)
    {
        $disk     = $this->backupDisk();
        $filePath = $this->backupDirectory() . '/' . $filename;

        abort_if(!$disk->exists($filePath), 404, 'Fail tidak dijumpai.');

        $disk->delete($filePath);

        ActivityLogger::log('delete', "Fail backup dipadam: \"{$filename}\"");

        return back()->with('success', 'Fail backup dipadam.');
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes >= 1073741824) {
            return round($bytes / 1073741824, 2) . ' GB';
        }
        if ($bytes >= 1048576) {
            return round($bytes / 1048576, 2) . ' MB';
        }
        if ($bytes >= 1024) {
            return round($bytes / 1024, 2) . ' KB';
        }
        return $bytes . ' B';
    }
}
