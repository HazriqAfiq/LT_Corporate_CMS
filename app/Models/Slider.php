<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'title_en',
        'subtitle',
        'subtitle_en',
        'description',
        'description_en',
        'media_id',
        'button_text',
        'button_text_en',
        'button_url',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Scope to get only active sliders.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by position.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
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
     * Get localized subtitle.
     */
    public function getLocalizedSubtitle(): ?string
    {
        $locale = app()->getLocale();
        return ($locale === 'en' && $this->subtitle_en) ? $this->subtitle_en : $this->subtitle;
    }

    /**
     * Get localized button text.
     */
    public function getLocalizedButtonText(): ?string
    {
        $locale = app()->getLocale();
        return ($locale === 'en' && $this->button_text_en) ? $this->button_text_en : $this->button_text;
    }

    /**
     * Get the associated media.
     */
    public function media(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Media::class, 'media_id');
    }

    /**
     * Get the media attribute.
     */
    public function getMediaAttribute()
    {
        return $this->relationLoaded('media')
            ? $this->getRelation('media')
            : $this->media()->getResults();
    }
}
