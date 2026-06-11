<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'title_en',
        'slug',
        'excerpt',
        'excerpt_en',
        'content',
        'content_en',
        'featured_media_id',
        'gallery_media_ids',
        'category',
        'tags',
        'meta_title',
        'meta_description',
        'author_id',
        'is_published',
        'is_featured',
        'is_archived',
        'views_count',
        'published_at',
    ];

    protected $casts = [
        'tags' => 'array',
        'gallery_media_ids' => 'array',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'is_archived' => 'boolean',
        'views_count' => 'integer',
        'published_at' => 'datetime',
    ];

    /**
     * Auto-generate slug from title.
     */
    protected static function booted(): void
    {
        static::creating(function (Article $article) {
            if (empty($article->slug)) {
                $article->slug = static::generateUniqueSlug($article->title);
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
     * Get the author of the article.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Get the featured media.
     */
    public function featuredMedia(): BelongsTo
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

    /**
     * Scope to get only published articles.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
                     ->where('is_archived', false)
                     ->where('published_at', '<=', now());
    }

    /**
     * Scope to get only featured articles.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope to filter by category.
     */
    public function scopeCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Increment the view count.
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
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
     * Get localized excerpt.
     */
    public function getLocalizedExcerpt(): ?string
    {
        $locale = app()->getLocale();
        return ($locale === 'en' && $this->excerpt_en) ? $this->excerpt_en : $this->excerpt;
    }

    /**
     * Get localized content.
     */
    public function getLocalizedContent(): string
    {
        $locale = app()->getLocale();
        return ($locale === 'en' && $this->content_en) ? $this->content_en : $this->content;
    }
}
