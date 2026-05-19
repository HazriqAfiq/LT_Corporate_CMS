<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'name_en',
        'slug',
        'description',
        'description_en',
        'content',
        'content_en',
        'icon',
        'featured_image',
        'features',
        'features_en',
        'price',
        'demo_url',
        'category',
        'is_active',
        'is_featured',
        'order',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'features' => 'array',
        'features_en' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Auto-generate slug from name.
     */
    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    /**
     * Scope to get only active products.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get only featured products.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope to order by position.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    /**
     * Get localized name.
     */
    public function getLocalizedName(): string
    {
        $locale = app()->getLocale();
        return ($locale === 'en' && $this->name_en) ? $this->name_en : $this->name;
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
     * Get localized features.
     */
    public function getLocalizedFeatures(): ?array
    {
        $locale = app()->getLocale();
        return ($locale === 'en' && $this->features_en) ? $this->features_en : $this->features;
    }
}
