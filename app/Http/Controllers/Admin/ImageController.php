<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    /**
     * Upload an image from the Quill rich-text editor and return its URL.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120|mimetypes:image/jpeg,image/png,image/gif,image/webp,image/svg+xml',
        ]);

        $path = $request->file('image')->store('articles/inline', 'public');

        return response()->json([
            'url' => asset('storage/' . $path),
        ]);
    }

    /**
     * Show the Branding management page.
     */
    public function branding()
    {
        return redirect()->route('admin.settings.index', ['tab' => 'branding']);
    }

    /**
     * Update branding images.
     */
    public function updateBranding(Request $request)
    {
        $request->validate([
            'logo'             => 'nullable|image|max:2048|mimes:png,svg,jpg,jpeg,webp',
            'logo_dark'        => 'nullable|image|max:2048|mimes:png,svg,jpg,jpeg,webp',
            'logo_footer'      => 'nullable|image|max:2048|mimes:png,svg,jpg,jpeg,webp',
            'favicon'          => 'nullable|file|max:512|mimes:ico,png,svg',
            'login_background' => 'nullable|image|max:5120|mimes:jpg,jpeg,png,webp',
        ]);

        $fields = ['logo', 'logo_dark', 'logo_footer', 'favicon', 'login_background'];

        foreach ($fields as $field) {
            if ($request->hasFile($field)) {
                // Delete old file if exists
                $existing = Setting::where('key', $field)->first();
                if ($existing && $existing->value) {
                    $oldPath = str_replace('/storage/', '', parse_url($existing->value, PHP_URL_PATH));
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }

                $path = $request->file($field)->store('settings/branding', 'public');
                $url  = asset('storage/' . $path);

                Setting::updateOrCreate(
                    ['key' => $field],
                    [
                        'value' => $url,
                        'group' => 'general',
                        'type'  => 'image',
                        'label' => ucwords(str_replace('_', ' ', $field)),
                    ]
                );
            }
        }

        return redirect()->route('admin.settings.index', ['tab' => 'branding'])
            ->with('success', 'Branding berjaya dikemaskini.');
    }

    /**
     * Remove a specific branding image.
     */
    public function removeBranding(Request $request)
    {
        $request->validate([
            'key' => 'required|string|in:logo,logo_dark,logo_footer,favicon,login_background',
        ]);

        $setting = Setting::where('key', $request->input('key'))->first();

        if ($setting && $setting->value) {
            $oldPath = ltrim(str_replace(asset('storage'), '', $setting->value), '/');
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
            $setting->update(['value' => null]);
        }

        return response()->json(['success' => true]);
    }
}
