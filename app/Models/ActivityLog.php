<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ActivityLog extends Model
{
    protected $table = 'activity_log';

    protected $fillable = [
        'log_name',
        'description',
        'subject_type',
        'subject_id',
        'event',
        'causer_type',
        'causer_id',
        'attribute_changes',
        'properties',
    ];

    protected function casts(): array
    {
        return [
            'attribute_changes' => 'array',
            'properties'        => 'array',
        ];
    }

    /**
     * The subject of the activity (e.g. Article, Product, etc.)
     */
    public function subject(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * The causer of the activity (usually a User).
     */
    public function causer(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Convenience accessor: the causer's name.
     */
    public function getCauserNameAttribute(): string
    {
        return $this->causer?->name ?? 'Sistem';
    }
}
