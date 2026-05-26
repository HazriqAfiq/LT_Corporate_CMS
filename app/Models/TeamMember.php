<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'role',
        'role_en',
        'profile_media_id',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = [
        'media_id',
        'media',
    ];

    /**
     * Scope to get only active members.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order members by their display order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc')->orderBy('id', 'asc');
    }

    /**
     * Get localized role.
     */
    public function getLocalizedRole(): string
    {
        $locale = app()->getLocale();
        return ($locale === 'en' && $this->role_en) ? $this->role_en : $this->role;
    }

    /**
     * Get the profile media.
     */
    public function profileMedia(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Media::class, 'profile_media_id');
    }

    /**
     * Get the profile media attribute.
     */
    public function getProfileMediaAttribute()
    {
        return $this->relationLoaded('profileMedia')
            ? $this->getRelation('profileMedia')
            : $this->profileMedia()->getResults();
    }

    /**
     * Get mapped media id attribute.
     */
    public function getMediaIdAttribute()
    {
        return $this->profile_media_id;
    }

    /**
     * Get mapped media attribute.
     */
    public function getMediaAttribute()
    {
        return $this->profile_media;
    }
}
