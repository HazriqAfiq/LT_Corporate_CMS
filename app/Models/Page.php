<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Page extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'title_en',
        'slug',
        'content',
        'content_en',
        'meta_title',
        'meta_title_en',
        'meta_description',
        'meta_description_en',
        'featured_image',
        'template',
        'is_published',
        'published_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    /**
     * Auto-generate slug from title.
     */
    protected static function booted(): void
    {
        static::creating(function (Page $page) {
            if (empty($page->slug)) {
                $page->slug = Str::slug($page->title);
            }
        });
    }

    /**
     * Scope to get only published pages.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
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
     * Get localized content.
     */
    public function getLocalizedContent(): ?string
    {
        $locale = app()->getLocale();
        return ($locale === 'en' && $this->content_en) ? $this->content_en : $this->content;
    }

    /**
     * Get localized meta title.
     */
    public function getLocalizedMetaTitle(): ?string
    {
        $locale = app()->getLocale();
        return ($locale === 'en' && $this->meta_title_en) ? $this->meta_title_en : $this->meta_title;
    }

    /**
     * Get localized meta description.
     */
    public function getLocalizedMetaDescription(): ?string
    {
        $locale = app()->getLocale();
        return ($locale === 'en' && $this->meta_description_en) ? $this->meta_description_en : $this->meta_description;
    }
}
