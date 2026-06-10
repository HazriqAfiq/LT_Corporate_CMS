<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'type',
        'extension',
        'duration',
        'caption',
        'description',
        'is_public',
        'filename',
        'original_filename',
        'path',
        'disk',
        'mime_type',
        'size',
        'alt_text',
        'title',
        'collection',
        'folder',
        'width',
        'height',
        'thumbnail_path',
        'uploaded_by',
    ];

    protected $casts = [
        'size'      => 'integer',
        'width'     => 'integer',
        'height'    => 'integer',
        'duration'  => 'integer',
        'is_public' => 'boolean',
    ];

    protected $appends = [
        'url',
        'thumbnail_url',
        'human_size',
        'is_image',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) \Illuminate\Support\Str::uuid();
            }
        });
    }

    /**
     * All valid collections.
     */
    public const COLLECTIONS = [
        'branding', 'sliders', 'articles', 'newsletter',
        'products', 'portfolio', 'projects', 'users', 'team_members', 'seo',
    ];

    /**
     * Get the user who uploaded this media.
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Get the full URL for the media file.
     */
    public function getUrlAttribute(): string
    {
        return '/storage/' . $this->path;
    }

    /**
     * Get the full URL for the thumbnail (falls back to main URL).
     */
    public function getThumbnailUrlAttribute(): string
    {
        if ($this->thumbnail_path) {
            return '/storage/' . $this->thumbnail_path;
        }
        return $this->url;
    }

    /**
     * Get a human-readable file size.
     */
    public function getHumanSizeAttribute(): string
    {
        $bytes = $this->size;
        $units = ['B', 'KB', 'MB', 'GB'];
        $index = 0;

        while ($bytes >= 1024 && $index < count($units) - 1) {
            $bytes /= 1024;
            $index++;
        }

        return round($bytes, 2) . ' ' . $units[$index];
    }

    /**
     * Check if the media is an image.
     */
    public function getIsImageAttribute(): bool
    {
        if (str_starts_with($this->mime_type ?? '', 'image/')) {
            return true;
        }

        $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'avif'];
        return in_array(strtolower($this->extension ?? ''), $imageExtensions) || $this->type === 'image';
    }

    /**
     * Scope to filter by collection.
     */
    public function scopeInCollection($query, string $collection)
    {
        return $query->where('collection', $collection);
    }

    /**
     * Scope to filter images only.
     */
    public function scopeImages($query)
    {
        return $query->where('mime_type', 'like', 'image/%');
    }
}
