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
            $model->convertToWebp();
        });
    }

    /**
     * Automatically convert the image to WebP if GD or Imagick is available.
     */
    public function convertToWebp()
    {
        if ($this->type !== 'image' || strtolower($this->extension) === 'webp' || strtolower($this->extension) === 'svg') {
            return;
        }

        try {
            $disk = \Illuminate\Support\Facades\Storage::disk($this->disk ?? 'public');
            $fullPath = $disk->path($this->path);

            if (!file_exists($fullPath)) {
                return;
            }

            $newExtension = 'webp';
            $newFilename = preg_replace('/\.' . preg_quote($this->extension, '/') . '$/i', '.webp', $this->filename);
            $newPath = preg_replace('/\.' . preg_quote($this->extension, '/') . '$/i', '.webp', $this->path);
            $newFullPath = $disk->path($newPath);

            $converted = false;

            // Try GD first
            if (extension_loaded('gd') && function_exists('imagewebp')) {
                try {
                    $imageInfo = getimagesize($fullPath);
                    if ($imageInfo) {
                        $mime = $imageInfo['mime'];
                        $image = null;
                        if ($mime === 'image/jpeg') {
                            $image = imagecreatefromjpeg($fullPath);
                        } elseif ($mime === 'image/png') {
                            $image = imagecreatefrompng($fullPath);
                            if ($image) {
                                imagepalettetotruecolor($image);
                                imagealphablending($image, true);
                                imagesavealpha($image, true);
                            }
                        } elseif ($mime === 'image/gif') {
                            $image = imagecreatefromgif($fullPath);
                        } elseif ($mime === 'image/webp') {
                            $image = imagecreatefromwebp($fullPath);
                        }

                        if ($image) {
                            imagewebp($image, $newFullPath, 80);
                            imagedestroy($image);
                            $converted = true;
                        }
                    }
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error("WebP Conversion via GD failed: " . $e->getMessage());
                }
            }

            // Try Imagick if GD failed or is not available
            if (!$converted && extension_loaded('imagick')) {
                try {
                    $imagick = new \Imagick($fullPath);
                    $imagick->setImageFormat('webp');
                    $imagick->setImageCompressionQuality(80);
                    $imagick->writeImage($newFullPath);
                    $imagick->clear();
                    $imagick->destroy();
                    $converted = true;
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error("WebP Conversion via Imagick failed: " . $e->getMessage());
                }
            }

            if ($converted) {
                // Delete old file
                if (file_exists($fullPath)) {
                    unlink($fullPath);
                }

                // Update model properties
                $this->path = $newPath;
                $this->filename = $newFilename;
                $this->extension = $newExtension;
                $this->mime_type = 'image/webp';
                $this->size = file_exists($newFullPath) ? filesize($newFullPath) : $this->size;

                $oldExt = pathinfo($this->original_filename, PATHINFO_EXTENSION);
                if ($oldExt) {
                    $this->original_filename = preg_replace('/\.' . preg_quote($oldExt, '/') . '$/i', '.webp', $this->original_filename);
                } else {
                    $this->original_filename .= '.webp';
                }

                // Handle thumbnail conversion if thumbnail exists
                if ($this->thumbnail_path) {
                    $oldThumbPath = $disk->path($this->thumbnail_path);
                    if (file_exists($oldThumbPath)) {
                        $newThumbPath = preg_replace('/\.' . preg_quote($this->extension, '/') . '$/i', '.webp', $this->thumbnail_path);
                        $newThumbFullPath = $disk->path($newThumbPath);
                        $thumbConverted = false;

                        if (extension_loaded('gd') && function_exists('imagewebp')) {
                            try {
                                $thumbImage = imagecreatefromstring(file_get_contents($oldThumbPath));
                                if ($thumbImage) {
                                    imagewebp($thumbImage, $newThumbFullPath, 80);
                                    imagedestroy($thumbImage);
                                    $thumbConverted = true;
                                }
                            } catch (\Exception $e) {}
                        }

                        if (!$thumbConverted && extension_loaded('imagick')) {
                            try {
                                $imagick = new \Imagick($oldThumbPath);
                                $imagick->setImageFormat('webp');
                                $imagick->setImageCompressionQuality(80);
                                $imagick->writeImage($newThumbFullPath);
                                $imagick->clear();
                                $imagick->destroy();
                                $thumbConverted = true;
                            } catch (\Exception $e) {}
                        }

                        if ($thumbConverted) {
                            if (file_exists($oldThumbPath)) {
                                unlink($oldThumbPath);
                            }
                            $this->thumbnail_path = $newThumbPath;
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("WebP conversion main loop error: " . $e->getMessage());
        }
    }

    /**
     * All valid collections.
     */
    public const COLLECTIONS = [
        'branding', 'sliders', 'articles', 'newsletter',
        'products', 'portfolio', 'projects', 'users', 'team_members', 'seo', 'services',
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
