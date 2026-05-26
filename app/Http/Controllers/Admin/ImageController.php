<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\ActivityLogger;
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

        $file = $request->file('image');
        $path = $file->store('uploads/articles/inline', 'public');

        $filename = basename($path);
        \App\Models\Media::create([
            'uuid' => (string) \Illuminate\Support\Str::uuid(),
            'filename' => $filename,
            'original_filename' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'type' => 'image',
            'extension' => $file->getClientOriginalExtension(),
            'size' => $file->getSize(),
            'disk' => 'public',
            'collection' => 'articles',
            'uploaded_by' => auth()->id(),
        ]);

        return response()->json([
            'url' => asset('storage/' . $path),
        ]);
    }

    /**
     * Show the Branding management page.
     */
    public function branding()
    {
        $brandingKeys = ['logo', 'logo_dark', 'logo_footer', 'favicon', 'login_background', 'homepage_background'];
        $brandingSettings = Setting::whereIn('key', $brandingKeys)->with('media')->get()->keyBy('key');

        return Inertia::render('Admin/Branding/Index', [
            'brandingSettings' => $brandingSettings,
        ]);
    }

    /**
     * Update branding setting using a media_id from MediaGallery.
     */
    public function updateBrandingMedia(Request $request)
    {
        $request->validate([
            'key' => 'required|string|in:logo,logo_dark,logo_footer,favicon,login_background,homepage_background',
            'media_id' => 'nullable|exists:media,id'
        ]);

        $key = $request->input('key');
        $mediaId = $request->input('media_id');

        Setting::updateOrCreate(
            ['key' => $key],
            [
                'value' => $mediaId,
                'group' => 'general',
                'type'  => 'image',
                'label' => ucwords(str_replace('_', ' ', $key)),
            ]
        );

        ActivityLogger::log('update', "Imej branding '{$key}' telah dikemaskini.");

        return response()->json(['success' => true]);
    }
}
