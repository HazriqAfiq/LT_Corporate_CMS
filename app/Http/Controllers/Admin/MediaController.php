<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class MediaController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view_media', only: ['index', 'show']),
            new Middleware('permission:upload_media', only: ['store', 'rename']),
            new Middleware('permission:delete_media', only: ['destroy', 'bulkDelete']),
        ];
    }

    public function index(Request $request)
    {
        $query = Media::query()->with('uploader');

        if ($search = $request->input('search')) {
            $query->where('original_filename', 'like', "%{$search}%")
                  ->orWhere('title', 'like', "%{$search}%");
        }

        if ($request->filled('collection')) {
            $query->where('collection', $request->input('collection'));
        }

        if ($request->filled('folder')) {
            $query->where('folder', $request->input('folder'));
        }

        if ($request->filled('type')) {
            $type = $request->input('type');
            if ($type === 'image') {
                $query->where('mime_type', 'like', 'image/%');
            } elseif ($type === 'video') {
                $query->where('mime_type', 'like', 'video/%');
            } elseif ($type === 'document') {
                $query->where('mime_type', 'application/pdf');
            }
        }

        $media = $query->latest()->paginate(24)->withQueryString();

        if (($request->wantsJson() || $request->ajax()) && !$request->header('X-Inertia')) {
            return response()->json([
                'success' => true,
                'media'   => $media,
            ]);
        }

        return Inertia::render('Admin/Media/Index', [
            'media'       => $media,
            'filters'     => $request->only(['search', 'collection', 'folder', 'type']),
            'collections' => Media::COLLECTIONS,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Media/Create', [
            'collections' => Media::COLLECTIONS,
        ]);
    }

    /**
     * Store one or multiple uploaded files.
     */
    public function store(Request $request)
    {
        $request->validate([
            'files'      => 'required|array|min:1|max:20',
            'files.*'    => 'required|file|max:10240|mimes:jpeg,png,jpg,gif,webp,svg,pdf,mp4,webm',
            'collection' => 'nullable|string|in:' . implode(',', Media::COLLECTIONS),
            'folder'     => 'nullable|string|max:100',
            'alt_text'   => 'nullable|string|max:255',
        ]);

        $collection = $request->input('collection', 'branding');
        $folder     = $request->input('folder');
        $storagePath = 'uploads/' . $collection . ($folder ? '/' . $folder : '');

        $uploaded = 0;
        $mediaItems = [];
        foreach ($request->file('files') as $file) {
            $originalName = $file->getClientOriginalName();
            $mimeType     = $file->getMimeType();
            $size         = $file->getSize();

            // Sanitize filename
            $safeName = Str::slug(pathinfo($originalName, PATHINFO_FILENAME))
                . '-' . Str::random(6)
                . '.' . $file->getClientOriginalExtension();

            $path = $file->storeAs($storagePath, $safeName, 'public');

            // Get image dimensions if it's an image
            $width = $height = null;
            if (str_starts_with($mimeType, 'image/') && $mimeType !== 'image/svg+xml') {
                try {
                    [$width, $height] = getimagesize($file->getRealPath());
                } catch (\Exception $e) {
                    // Ignore dimension errors
                }
            }

            $type = 'document';
            if (str_starts_with($mimeType, 'image/')) $type = 'image';
            elseif (str_starts_with($mimeType, 'video/')) $type = 'video';
            elseif (str_starts_with($mimeType, 'audio/')) $type = 'audio';

            $mediaItems[] = Media::create([
                'path'              => $path,
                'filename'          => $safeName,
                'original_filename' => $originalName,
                'mime_type'         => $mimeType,
                'type'              => $type,
                'extension'         => $file->getClientOriginalExtension(),
                'size'              => $size,
                'disk'              => 'public',
                'collection'        => $collection,
                'folder'            => $folder,
                'width'             => $width,
                'height'            => $height,
                'alt_text'          => $request->input('alt_text'),
                'uploaded_by'       => auth()->id(),
            ]);

            $uploaded++;
        }

        if ($uploaded > 0) {
            ActivityLogger::log('upload', "{$uploaded} fail media telah dimuat naik.");
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "{$uploaded} fail berjaya dimuat naik.",
                'media'   => $mediaItems
            ]);
        }

        return redirect()->route('admin.media.index')
            ->with('success', "{$uploaded} fail berjaya dimuat naik.");
    }

    public function edit(Media $medium)
    {
        return Inertia::render('Admin/Media/Edit', [
            'media'       => $medium->append(['url', 'human_size', 'is_image']),
            'collections' => Media::COLLECTIONS,
        ]);
    }

    public function update(Request $request, Media $medium)
    {
        $validated = $request->validate([
            'title'      => 'nullable|string|max:255',
            'alt_text'   => 'nullable|string|max:255',
            'collection' => 'required|string|in:' . implode(',', Media::COLLECTIONS),
            'folder'     => 'nullable|string|max:100',
        ]);

        $medium->update($validated);

        ActivityLogger::logUpdate('Media', $medium->original_filename, $medium);

        return redirect()->route('admin.media.index')
            ->with('success', 'Maklumat media berjaya dikemaskini.');
    }

    /**
     * Rename a media file (title / original_filename display name).
     */
    public function rename(Request $request, Media $medium)
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $medium->update(['title' => $request->input('title')]);

        ActivityLogger::logUpdate('Media', $medium->title, $medium);

        return response()->json(['success' => true, 'title' => $medium->title]);
    }

    public function destroy(Media $medium)
    {
        if (Storage::disk($medium->disk)->exists($medium->path)) {
            Storage::disk($medium->disk)->delete($medium->path);
        }
        if ($medium->thumbnail_path && Storage::disk($medium->disk)->exists($medium->thumbnail_path)) {
            Storage::disk($medium->disk)->delete($medium->thumbnail_path);
        }

        $mediaName = $medium->original_filename;
        $medium->delete();

        ActivityLogger::logDelete('Media', $mediaName);

        return redirect()->route('admin.media.index')
            ->with('success', 'Media berjaya dipadam.');
    }

    /**
     * Bulk delete media items.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids'   => 'required|array|min:1',
            'ids.*' => 'integer|exists:media,id',
        ]);

        $items = Media::whereIn('id', $request->input('ids'))->get();
        $deletedCount = $items->count();

        foreach ($items as $medium) {
            if (Storage::disk($medium->disk)->exists($medium->path)) {
                Storage::disk($medium->disk)->delete($medium->path);
            }
            $medium->delete();
        }

        if ($deletedCount > 0) {
            ActivityLogger::log('delete', "{$deletedCount} fail media telah dipadam secara pukal.");
        }

        return response()->json([
            'success' => true,
            'deleted' => $deletedCount,
        ]);
    }
}
