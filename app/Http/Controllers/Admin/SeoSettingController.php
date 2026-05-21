<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SeoSettingController extends Controller
{
    public function index(Request $request)
    {
        $query = Setting::query()->where('group', 'seo');

        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('key', 'like', "%{$search}%")
                  ->orWhere('label', 'like', "%{$search}%");
            });
        }

        $settings = $query->orderBy('key')->paginate(15)->withQueryString();

        return Inertia::render('Admin/SeoSettings/Index', [
            'settings' => $settings,
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
            'value' => 'nullable|string',
        ]);

        $validated['group'] = 'seo';

        Setting::create($validated);

        return redirect()->route('admin.seo-settings.index')->with('success', 'Tetapan SEO berjaya ditambah.');
    }

    public function edit(Setting $seo_setting)
    {
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
            'value' => 'nullable|string',
        ]);

        $seo_setting->update($validated);

        return redirect()->route('admin.seo-settings.index')->with('success', 'Tetapan SEO berjaya dikemaskini.');
    }

    public function destroy(Setting $seo_setting)
    {
        $seo_setting->delete();
        return redirect()->route('admin.seo-settings.index')->with('success', 'Tetapan SEO dipadam.');
    }
}
