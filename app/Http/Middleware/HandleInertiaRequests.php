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
                }
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? array_merge(
                    $request->user()->toArray(),
                    [
                        'roles'       => $request->user()->getRoleNames(),
                        'permissions' => $request->user()->getAllPermissions()->pluck('name'),
                    ]
                ) : null,
            ],
            'settings' => $settings,
        ];
    }
}
