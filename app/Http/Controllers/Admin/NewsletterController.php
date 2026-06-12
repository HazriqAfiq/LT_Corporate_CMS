<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\NewsletterMail;
use App\Models\NewsletterCampaign;
use App\Models\NewsletterSubscriber;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class NewsletterController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:access_newsletter'),
        ];
    }
    public function index(Request $request)
    {
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

        $campaigns = NewsletterCampaign::with('creator')->latest()->limit(20)->get();

        return Inertia::render('Admin/Newsletter/Index', [
            'subscribers' => $subscribers,
            'filters'     => $request->only(['search', 'is_active']),
            'stats'       => $stats,
            'campaigns'   => $campaigns,
        ]);
    }

    public function destroy(NewsletterSubscriber $newsletter)
    {
        $email = $newsletter->email;
        $newsletter->delete();

        ActivityLogger::logDelete('Pelanggan Newsletter', $email);

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

    public function show(NewsletterCampaign $campaign)
    {
        $settings = \App\Models\Setting::whereIn('key', [
            'logo', 'site_name',
        ])->with('media')->get()->keyBy('key');

        $logoSetting = $settings->get('logo');
        $siteNameSetting = $settings->get('site_name');

        return Inertia::render('Admin/Newsletter/Preview', [
            'campaign' => $campaign->load('creator'),
            'branding' => [
                'logo'       => $logoSetting?->media?->url ?? null,
                'site_name'  => $siteNameSetting?->value ?? 'Laman Teknologi',
                'site_url'   => config('app.url'),
                'from_email' => config('mail.from.address'),
            ],
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

        $campaign = NewsletterCampaign::create([
            'subject'         => $validated['subject'],
            'body'            => $validated['body'],
            'recipient_count' => $subscribers->count(),
            'created_by'      => auth()->id(),
            'sent_at'         => now(),
        ]);

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

        $campaign->update([
            'sent_count'   => $sent,
            'failed_count' => $failed,
        ]);

        ActivityLogger::log('send', "Kempen newsletter \"{$validated['subject']}\" dihantar kepada {$sent} penerima" . ($failed > 0 ? " ({$failed} gagal)" : ""), $campaign);

        return response()->json([
            'success'  => true,
            'sent'     => $sent,
            'failed'   => $failed,
            'campaign' => $campaign->load('creator'),
        ]);
    }
}
