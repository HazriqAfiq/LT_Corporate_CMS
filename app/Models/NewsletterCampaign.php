<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsletterCampaign extends Model
{
    protected $table = 'newsletter_campaigns';

    protected $fillable = [
        'subject',
        'body',
        'sent_count',
        'failed_count',
        'recipient_count',
        'created_by',
        'sent_at',
    ];

    protected $casts = [
        'sent_count'      => 'integer',
        'failed_count'    => 'integer',
        'recipient_count' => 'integer',
        'sent_at'         => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
