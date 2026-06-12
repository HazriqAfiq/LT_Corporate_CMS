<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class SettingController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:access_settings'),
        ];
    }

    public function index(Request $request)
    {
        $brandingKeys = ['logo', 'logo_dark', 'logo_footer', 'favicon', 'login_background', 'homepage_background'];

        $query = Setting::query()
            ->where('group', '!=', 'seo')
            ->whereNotIn('key', $brandingKeys);

        if ($search = $request->input('search')) {
            $query->where('key', 'like', "%{$search}%")
                  ->orWhere('label', 'like', "%{$search}%");
        }

        if ($request->filled('group')) {
            $query->where('group', $request->input('group'));
        }

        $settings = $query->orderBy('group')->orderBy('key')->paginate(15)->withQueryString();
        $settings->getCollection()->load('media');

        $allSettings = Setting::where('group', '!=', 'seo')
            ->whereNotIn('key', $brandingKeys)
            ->with('media')
            ->get();

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
            'allSettings' => $allSettings,
            'filters' => $request->only(['search', 'group']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Settings/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255|unique:settings',
            'label' => 'nullable|string|max:255',
            'label_en' => 'nullable|string|max:255',
            'group' => 'required|string|in:general,contact,social,company,footer',
            'type' => 'required|string|in:text,textarea,image,boolean',
            'value' => $request->input('type') === 'image' ? 'nullable|exists:media,id' : 'nullable|string',
            'value_en' => 'nullable|string',
        ]);

        $setting = Setting::create($validated);

        ActivityLogger::logCreate('Tetapan', $setting->key, $setting);

        return redirect()->route('admin.settings.index')->with('success', 'Tetapan berjaya ditambah.');
    }

    public function edit(Setting $setting)
    {
        $setting->load('media');
        return Inertia::render('Admin/Settings/Edit', [
            'setting' => $setting,
        ]);
    }

    public function update(Request $request, Setting $setting)
    {
        $validated = $request->validate([
            'label' => 'nullable|string|max:255',
            'label_en' => 'nullable|string|max:255',
            'group' => 'required|string|in:general,contact,social,company,footer',
            'type' => 'required|string|in:text,textarea,image,boolean',
            'value' => $request->input('type') === 'image' || $setting->type === 'image' 
                ? 'nullable|exists:media,id' 
                : 'nullable|string',
            'value_en' => 'nullable|string',
        ]);

        $setting->update($validated);

        ActivityLogger::logUpdate('Tetapan', $setting->key, $setting);

        return back()->with('success', 'Tetapan berjaya dikemaskini.');
    }

    public function destroy(Setting $setting)
    {
        $settingKey = $setting->key;
        $setting->delete();

        ActivityLogger::logDelete('Tetapan', $settingKey);
        return redirect()->route('admin.settings.index')->with('success', 'Tetapan dipadam.');
    }

    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|exists:settings,key',
            'settings.*.value' => 'nullable',
            'settings.*.value_en' => 'nullable',
        ]);

        foreach ($validated['settings'] as $item) {
            $updateData = ['value' => $item['value']];
            if (array_key_exists('value_en', $item)) {
                $updateData['value_en'] = $item['value_en'];
            }
            
            Setting::where('key', $item['key'])->update($updateData);
            
            // Forget cache for updated key
            \Illuminate\Support\Facades\Cache::forget("setting.{$item['key']}");
        }

        ActivityLogger::log('update', "Pelbagai tetapan telah dikemaskini secara pukal.");

        return redirect()->back()->with('success', 'Semua tetapan berjaya disimpan.');
    }
}
