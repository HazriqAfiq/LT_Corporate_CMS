<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class SeoSettingController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:access_seo'),
        ];
    }

    public function index(Request $request)
    {
        $seoImageSetting = Setting::firstOrCreate(
            ['key' => 'seo_image'],
            [
                'group' => 'seo',
                'type' => 'image',
                'label' => 'Imej SEO Lalai',
                'label_en' => 'Default SEO Image',
                'value' => null,
            ]
        );
        $seoImageSetting->load('media');

        $query = Setting::query()
            ->where('group', 'seo')
            ->where('key', '!=', 'seo_image');

        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('key', 'like', "%{$search}%")
                  ->orWhere('label', 'like', "%{$search}%");
            });
        }

        $settings = $query->orderBy('key')->paginate(15)->withQueryString();
        $settings->getCollection()->load('media');

        return Inertia::render('Admin/SeoSettings/Index', [
            'settings' => $settings,
            'seoImageSetting' => $seoImageSetting,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/SeoSettings/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255|unique:settings',
            'label' => 'nullable|string|max:255',
            'label_en' => 'nullable|string|max:255',
            'type' => 'required|string|in:text,textarea,image,boolean',
            'value' => $request->input('type') === 'image' ? 'nullable|exists:media,id' : 'nullable|string',
        ]);

        $validated['group'] = 'seo';

        Setting::create($validated);

        ActivityLogger::log('update', "Tambah tetapan SEO: {$validated['key']}");

        return redirect()->route('admin.seo-settings.index')->with('success', 'Tetapan SEO berjaya ditambah.');
    }

    public function edit(Setting $seo_setting)
    {
        $seo_setting->load('media');
        return Inertia::render('Admin/SeoSettings/Edit', [
            'setting' => $seo_setting,
        ]);
    }

    public function update(Request $request, Setting $seo_setting)
    {
        $validated = $request->validate([
            'label' => 'nullable|string|max:255',
            'label_en' => 'nullable|string|max:255',
            'type' => 'required|string|in:text,textarea,image,boolean',
            'value' => $request->input('type') === 'image' || $seo_setting->type === 'image'
                ? 'nullable|exists:media,id'
                : 'nullable|string',
        ]);

        $seo_setting->update($validated);

        ActivityLogger::log('update', "Kemaskini tetapan SEO: {$seo_setting->key}", $seo_setting);

        return back()->with('success', 'Tetapan SEO berjaya dikemaskini.');
    }

    public function destroy(Setting $seo_setting)
    {
        $key = $seo_setting->key;
        $seo_setting->delete();

        ActivityLogger::log('delete', "Padam tetapan SEO: {$key}");

        return redirect()->route('admin.seo-settings.index')->with('success', 'Tetapan SEO dipadam.');
    }
}
