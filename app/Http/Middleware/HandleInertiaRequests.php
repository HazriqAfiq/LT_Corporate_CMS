<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $settings = [];
        if (\Illuminate\Support\Facades\Schema::hasTable('settings')) {
            $settingsData = \App\Models\Setting::with('media')->get();
            foreach ($settingsData as $setting) {
                if ($setting->type === 'image') {
                    if ($setting->media) {
                        $settings[$setting->key] = $setting->media->url;
                    } else {
                        $value = $setting->value;
                        if ($value) {
                            $settings[$setting->key] = (str_starts_with($value, 'http') || str_starts_with($value, '/storage') || str_starts_with($value, 'storage'))
                                ? (str_starts_with($value, '/storage') || str_starts_with($value, 'http') ? $value : '/storage/' . $value)
                                : '/storage/' . $value;
                        } else {
                            $settings[$setting->key] = null;
                        }
                    }
                } else {
                    $settings[$setting->key] = $setting->value;
                    $settings[$setting->key . '_en'] = $setting->value_en;
                }
            }
        }

        return [
            ...parent::share($request),
            'csrf_token' => csrf_token(),
            'auth' => [
                'user' => $request->user() ? array_merge(
                    $request->user()->toArray(),
                    [
                        'roles'       => $request->user()->getRoleNames(),
                        'permissions' => $request->user()->getAllPermissions()->pluck('name'),
                    ]
                ) : null,
            ],
            'unread_notifications' => [
                'inquiries' => ($request->user() && ($request->user()->hasRole('Super Admin') || $request->user()->can('view_inquiries'))) 
                    ? \App\Models\ContactInquiry::unread()->count() : 0,
                'newsletters' => ($request->user() && ($request->user()->hasRole('Super Admin') || $request->user()->can('access_newsletter')))
                    ? \App\Models\NewsletterSubscriber::unread()->count() : 0,
                'activity_logs' => ($request->user() && ($request->user()->hasRole('Super Admin') || $request->user()->can('access_activity_logs')))
                    ? \App\Models\ActivityLog::unread()->count() : 0,
                'backups' => ($request->user() && ($request->user()->hasRole('Super Admin') || $request->user()->can('access_backup')))
                    && (isset($settings['latest_backup_timestamp']) && $settings['latest_backup_timestamp'] > ($request->user()->last_viewed_backups_at ? $request->user()->last_viewed_backups_at->timestamp : 0)) ? 1 : 0,
            ],
            'settings' => $settings,
        ];
    }
}
