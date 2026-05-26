<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class ActivityLogger
{
    /**
     * Log an activity.
     *
     * @param  string      $event        e.g. 'create', 'update', 'delete', 'login', 'upload'
     * @param  string      $description  Human-readable description in BM
     * @param  Model|null  $subject      The model that was acted upon
     * @param  array       $properties   Extra metadata to store
     */
    public static function log(
        string $event,
        string $description,
        ?Model $subject = null,
        array $properties = []
    ): ActivityLog {
        $user = Auth::user();

        return ActivityLog::create([
            'log_name'    => $event,
            'event'       => $event,
            'description' => $description,
            'causer_type' => $user ? get_class($user) : null,
            'causer_id'   => $user?->id,
            'subject_type' => $subject ? get_class($subject) : null,
            'subject_id'   => $subject?->id,
            'properties'   => $properties,
        ]);
    }

    /**
     * Shorthand helpers.
     */
    public static function logCreate(string $module, string $name, ?Model $subject = null): ActivityLog
    {
        return static::log('create', "Tambah {$module} baharu: \"{$name}\"", $subject);
    }

    public static function logUpdate(string $module, string $name, ?Model $subject = null): ActivityLog
    {
        return static::log('update', "Kemaskini {$module}: \"{$name}\"", $subject);
    }

    public static function logDelete(string $module, string $name): ActivityLog
    {
        return static::log('delete', "Padam {$module}: \"{$name}\"");
    }

    public static function logUpload(string $filename, ?Model $subject = null): ActivityLog
    {
        return static::log('upload', "Muat naik fail: \"{$filename}\"", $subject);
    }

    public static function logLogin(string $name): ActivityLog
    {
        return static::log('login', "Log masuk ke sistem: {$name}");
    }
}
