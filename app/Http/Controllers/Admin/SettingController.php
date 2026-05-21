<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function index(Request $request)
    {
        $brandingKeys = ['logo', 'logo_dark', 'logo_footer', 'favicon', 'login_background'];

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

        $brandingSettings = Setting::whereIn('key', $brandingKeys)->get()->keyBy('key');

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
            'brandingSettings' => $brandingSettings,
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
            'value' => $request->input('type') === 'image' ? 'nullable|image|max:5120' : 'nullable|string',
        ]);

        if ($request->input('type') === 'image' && $request->hasFile('value')) {
            $validated['value'] = $request->file('value')->store('settings', 'public');
        }

        Setting::create($validated);

        return redirect()->route('admin.settings.index')->with('success', 'Tetapan berjaya ditambah.');
    }

    public function edit(Setting $setting)
    {
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
                ? 'nullable' 
                : 'nullable|string',
        ]);

        if ($request->input('type') === 'image' || $setting->type === 'image') {
            if ($request->hasFile('value')) {
                if ($setting->value && Storage::disk('public')->exists($setting->value)) {
                    Storage::disk('public')->delete($setting->value);
                }
                $validated['value'] = $request->file('value')->store('settings', 'public');
            } else {
                // Keep old image path if not replaced
                $validated['value'] = $setting->value;
            }
        }

        $setting->update($validated);

        return redirect()->route('admin.settings.index')->with('success', 'Tetapan berjaya dikemaskini.');
    }

    public function destroy(Setting $setting)
    {
        if ($setting->type === 'image' && $setting->value && Storage::disk('public')->exists($setting->value)) {
            Storage::disk('public')->delete($setting->value);
        }
        
        $setting->delete();
        return redirect()->route('admin.settings.index')->with('success', 'Tetapan dipadam.');
    }
}
