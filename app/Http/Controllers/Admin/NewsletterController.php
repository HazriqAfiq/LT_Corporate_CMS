<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\NewsletterMail;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class NewsletterController extends Controller
{
    public function index(Request $request)
    {
        // Mark all unread newsletters as read when visiting the index
        \App\Models\NewsletterSubscriber::unread()->update(['is_read' => true]);

        $query = NewsletterSubscriber::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->input('is_active') === 'true');
        }

        $subscribers = $query->latest()->paginate(20)->withQueryString();

        $stats = [
            'total'     => NewsletterSubscriber::count(),
            'active'    => NewsletterSubscriber::where('is_active', true)->count(),
            'this_month'=> NewsletterSubscriber::where('is_active', true)
                            ->whereMonth('created_at', now()->month)
                            ->whereYear('created_at', now()->year)
                            ->count(),
        ];

        return Inertia::render('Admin/Newsletter/Index', [
            'subscribers' => $subscribers,
            'filters'     => $request->only(['search', 'is_active']),
            'stats'       => $stats,
        ]);
    }

    public function destroy(NewsletterSubscriber $newsletter)
    {
        $newsletter->delete();

        return back()->with('success', 'Subscriber dipadam.');
    }

    public function toggleStatus(NewsletterSubscriber $newsletter)
    {
        $newsletter->update([
            'is_active'       => !$newsletter->is_active,
            'unsubscribed_at' => $newsletter->is_active ? now() : null,
        ]);

        return response()->json([
            'success'   => true,
            'is_active' => $newsletter->fresh()->is_active,
        ]);
    }

    public function export()
    {
        $subscribers = NewsletterSubscriber::orderBy('email')->get();

        $csv = "Name,Email,Status,Subscribed At\n";
        foreach ($subscribers as $sub) {
            $csv .= sprintf(
                '"%s","%s","%s","%s"' . "\n",
                $sub->name ?? '',
                $sub->email,
                $sub->is_active ? 'Active' : 'Inactive',
                $sub->created_at?->format('Y-m-d H:i:s') ?? ''
            );
        }

        return response($csv, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename="newsletter_subscribers_' . now()->format('Y-m-d') . '.csv"',
        ]);
    }

    public function sendCampaign(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'body'    => 'required|string|max:50000',
        ]);

        $subscribers = NewsletterSubscriber::active()->get();

        if ($subscribers->isEmpty()) {
            return response()->json(['success' => false, 'message' => 'Tiada subscriber aktif.'], 422);
        }

        $sent = 0;
        $failed = 0;
        foreach ($subscribers as $subscriber) {
            try {
                Mail::to($subscriber->email, $subscriber->name ?? '')
                    ->send(new NewsletterMail(
                        campaignSubject: $validated['subject'],
                        campaignBody: $validated['body'],
                    ));
                $sent++;
            } catch (\Throwable $e) {
                $failed++;
                \Log::warning('Newsletter send failed for ' . $subscriber->email . ': ' . $e->getMessage());
            }
        }

        return response()->json([
            'success' => true,
            'sent'    => $sent,
            'failed'  => $failed,
        ]);
    }
}
