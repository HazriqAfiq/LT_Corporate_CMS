<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PromoOrder extends Model
{
    protected $fillable = [
        'uuid',
        'name',
        'email',
        'phone',
        'company',
        'amount',
        'status',
        'payment_gateway',
        'payment_id',
        'notes',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * Get the count of successfully paid orders.
     */
    public static function getPaidSlotsCount(): int
    {
        return self::where('status', 'paid')->count();
    }
}
