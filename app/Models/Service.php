<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'name_en',
        'slug',
        'category',
        'icon',
        'description',
        'description_en',
        'content',
        'content_en',
        'features',
        'features_en',
        'price',
        'demo_url',
        'featured_media_id',
        'gallery_media_ids',
        'order',
        'is_active',
        'is_featured',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'features'         => 'array',
        'features_en'      => 'array',
        'gallery_media_ids'=> 'array',
        'is_active'        => 'boolean',
        'is_featured'      => 'boolean',
    ];

    // ── Relationships ──────────────────────────────────────────────────────────

    public function featuredMedia()
    {
        return $this->belongsTo(Media::class, 'featured_media_id');
    }

    public function getFeaturedMediaAttribute()
    {
        return $this->relationLoaded('featuredMedia')
            ? $this->getRelation('featuredMedia')
            : $this->featuredMedia()->getResults();
    }

    // ── Scopes ─────────────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('created_at', 'desc');
    }
}
