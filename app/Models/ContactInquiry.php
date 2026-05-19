<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactInquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'subject',
        'message',
        'is_read',
        'replied_at',
        'admin_notes',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'replied_at' => 'datetime',
    ];

    /**
     * Scope to get unread inquiries.
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope to get read inquiries.
     */
    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }

    /**
     * Mark the inquiry as read.
     */
    public function markAsRead(): void
    {
        $this->update(['is_read' => true]);
    }

    /**
     * Mark the inquiry as replied.
     */
    public function markAsReplied(): void
    {
        $this->update([
            'is_read' => true,
            'replied_at' => now(),
        ]);
    }
}
