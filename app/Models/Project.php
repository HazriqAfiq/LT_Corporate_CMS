<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'title_en',
        'slug',
        'description',
        'description_en',
        'content',
        'content_en',
        'client',
        'category',
        'featured_media_id',
        'gallery_media_ids',
        'technologies',
        'url',
        'testimonial',
        'testimonial_en',
        'testimonial_author',
        'is_featured',
        'is_published',
        'completed_at',
        'order',
    ];

    protected $casts = [
        'gallery_media_ids' => 'array',
        'technologies' => 'array',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'completed_at' => 'date',
        'order' => 'integer',
    ];

    /**
     * Auto-generate slug from title.
     */
    protected static function booted(): void
    {
        static::creating(function (Project $project) {
            if (empty($project->slug)) {
                $project->slug = static::generateUniqueSlug($project->title);
            }
        });
    }

    /**
     * Auto-generate a unique slug.
     */
    public static function generateUniqueSlug(string $title, ?int $excludeId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        while (static::where('slug', $slug)->where('id', '!=', $excludeId)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        return $slug;
    }

    /**
     * Scope to get only published projects.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope to get only featured projects.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope to order by completion date descending.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('completed_at', 'desc');
    }

    /**
     * Get localized title.
     */
    public function getLocalizedTitle(): string
    {
        $locale = app()->getLocale();
        return ($locale === 'en' && $this->title_en) ? $this->title_en : $this->title;
    }

    /**
     * Get localized description.
     */
    public function getLocalizedDescription(): ?string
    {
        $locale = app()->getLocale();
        return ($locale === 'en' && $this->description_en) ? $this->description_en : $this->description;
    }

    /**
     * Get localized content.
     */
    public function getLocalizedContent(): ?string
    {
        $locale = app()->getLocale();
        return ($locale === 'en' && $this->content_en) ? $this->content_en : $this->content;
    }

    /**
     * Get the featured media.
     */
    public function featuredMedia(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Media::class, 'featured_media_id');
    }

    /**
     * Get the featured media attribute.
     */
    public function getFeaturedMediaAttribute()
    {
        return $this->relationLoaded('featuredMedia')
            ? $this->getRelation('featuredMedia')
            : $this->featuredMedia()->getResults();
    }
}
