<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        // Mark all unread activity logs as read when visiting the index
        ActivityLog::unread()->update(['is_read' => true]);

        $query = ActivityLog::with('causer')
            ->orderBy('created_at', 'desc');

        // Filter: search description or causer name
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhereHasMorph('causer', [User::class], function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter: event type
        if ($event = $request->input('event')) {
            $query->where('event', $event);
        }

        // Filter: date range
        if ($dateFrom = $request->input('date_from')) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }
        if ($dateTo = $request->input('date_to')) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        $logs = $query->paginate(30)->withQueryString();

        // Transform for frontend
        $logs->through(function ($log) {
            return [
                'id'          => $log->id,
                'event'       => $log->event,
                'description' => $log->description,
                'user_name'   => $log->causer?->name ?? 'Sistem',
                'user_email'  => $log->causer?->email ?? null,
                'subject_type' => $log->subject_type ? class_basename($log->subject_type) : null,
                'subject_id'  => $log->subject_id,
                'created_at'  => $log->created_at->format('Y-m-d H:i:s'),
                'created_at_human' => $log->created_at->diffForHumans(),
            ];
        });

        return Inertia::render('Admin/ActivityLogs/Index', [
            'logs'    => $logs,
            'filters' => $request->only(['search', 'event', 'date_from', 'date_to']),
            'users'   => User::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function clear(Request $request)
    {
        ActivityLog::query()->delete();

        return back()->with('success', 'Semua log aktiviti telah dipadam.');
    }
}
