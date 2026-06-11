<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Services\ActivityLogger;
use App\Services\MediaUsageService;
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
            $query->where(function ($q) use ($search) {
                $q->where('original_filename', 'like', "%{$search}%")
                  ->orWhere('title', 'like', "%{$search}%")
                  ->orWhere('alt_text', 'like', "%{$search}%");
            });
        }

        if ($request->filled('collection')) {
            $query->where('collection', $request->input('collection'));
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

        $sortBy = $request->input('sort_by', 'created_at');
        $sortDir = $request->input('sort_dir', 'desc');

        $allowedSorts = ['created_at', 'filename', 'size', 'original_filename'];
        if (!in_array($sortBy, $allowedSorts)) $sortBy = 'created_at';
        if (!in_array($sortDir, ['asc', 'desc'])) $sortDir = 'desc';

        $query->orderBy($sortBy === 'filename' ? 'original_filename' : $sortBy, $sortDir);

        $perPage = $request->input('per_page', 24);
        $usageFilter = $request->input('usage', '');

        if ($usageFilter && $usageFilter !== 'all') {
            $usedIds = $this->getMediaIdsForUsage($usageFilter);
            if ($usageFilter === 'unused') {
                $query->whereNotIn('id', $usedIds);
            } else {
                $query->whereIn('id', $usedIds);
            }
        }

        $media = $query->paginate($perPage)->withQueryString();

        $mediaIds = $media->pluck('id')->toArray();

        $usageService = new MediaUsageService();
        $usageService->loadUsages($mediaIds);

        $usageData = [];
        foreach ($media->items() as $item) {
            $usageData[$item->id] = [
                'count'    => $usageService->getUsageCount($item->id),
                'summary'  => $usageService->getUsageSummary($item->id),
                'usages'   => $usageService->getUsage($item->id),
            ];
        }

        $isJson = ($request->wantsJson() || $request->ajax()) && !$request->header('X-Inertia');
        if ($isJson) {
            return response()->json([
                'success'    => true,
                'media'      => $media,
                'usageData'  => $usageData,
            ]);
        }

        return Inertia::render('Admin/Media/Index', [
            'media'        => $media,
            'filters'      => $request->only(['search', 'collection', 'type', 'usage', 'sort_by', 'sort_dir']),
            'collections'  => Media::COLLECTIONS,
            'usageTypes'   => MediaUsageService::USAGE_TYPES,
            'usageData'    => $usageData,
        ]);
    }

    private function getMediaIdsForUsage(string $type): array
    {
        $ids = [];

        if ($type === 'unused') {
            $used = [];
            $used = array_merge($used, \App\Models\Setting::where('type', 'image')->whereNotNull('value')->pluck('value')->map(fn($v) => (int)$v)->toArray());
            $used = array_merge($used, \App\Models\Setting::whereIn('key', ['seo_image', 'og_image'])->whereNotNull('value')->pluck('value')->map(fn($v) => (int)$v)->toArray());
            $used = array_merge($used, \App\Models\Slider::whereNotNull('media_id')->pluck('media_id')->toArray());
            $used = array_merge($used, \App\Models\TeamMember::whereNotNull('profile_media_id')->pluck('profile_media_id')->toArray());
            $used = array_merge($used, \App\Models\Service::whereNotNull('featured_media_id')->pluck('featured_media_id')->toArray());
            foreach (\App\Models\Service::whereNotNull('gallery_media_ids')->pluck('gallery_media_ids') as $g) {
                if (is_array($g)) $used = array_merge($used, $g);
            }
            $used = array_merge($used, \App\Models\Project::whereNotNull('featured_media_id')->pluck('featured_media_id')->toArray());
            foreach (\App\Models\Project::whereNotNull('gallery_media_ids')->pluck('gallery_media_ids') as $g) {
                if (is_array($g)) $used = array_merge($used, $g);
            }
            $used = array_merge($used, \App\Models\Product::whereNotNull('featured_media_id')->pluck('featured_media_id')->toArray());
            foreach (\App\Models\Product::whereNotNull('gallery_media_ids')->pluck('gallery_media_ids') as $g) {
                if (is_array($g)) $used = array_merge($used, $g);
            }
            $used = array_merge($used, \App\Models\Product::whereNotNull('icon')->get()->map(fn($p) => (int)$p->getRawOriginal('icon'))->toArray());
            $used = array_merge($used, \App\Models\Article::whereNotNull('featured_media_id')->pluck('featured_media_id')->toArray());
            foreach (\App\Models\Article::whereNotNull('gallery_media_ids')->pluck('gallery_media_ids') as $g) {
                if (is_array($g)) $used = array_merge($used, $g);
            }
            $used = array_merge($used, $this->getContentMediaIds(\App\Models\Article::class));
            $used = array_merge($used, $this->getContentMediaIds(\App\Models\Product::class));
            $used = array_merge($used, $this->getContentMediaIds(\App\Models\Project::class));
            return array_values(array_unique(array_filter($used)));
        }

        switch ($type) {
            case 'branding':
                $ids = \App\Models\Setting::where('type', 'image')->whereNotNull('value')->pluck('value')->map(fn($v) => (int)$v)->toArray();
                break;
            case 'seo':
                $ids = \App\Models\Setting::whereIn('key', ['seo_image', 'og_image'])->whereNotNull('value')->pluck('value')->map(fn($v) => (int)$v)->toArray();
                break;
            case 'slider':
                $ids = \App\Models\Slider::whereNotNull('media_id')->pluck('media_id')->toArray();
                break;
            case 'team':
                $ids = \App\Models\TeamMember::whereNotNull('profile_media_id')->pluck('profile_media_id')->toArray();
                break;
            case 'service_image':
                $ids = \App\Models\Service::whereNotNull('featured_media_id')->pluck('featured_media_id')->toArray();
                foreach (\App\Models\Service::whereNotNull('gallery_media_ids')->pluck('gallery_media_ids') as $g) {
                    if (is_array($g)) $ids = array_merge($ids, $g);
                }
                break;
            case 'project_gallery':
                $ids = \App\Models\Project::whereNotNull('featured_media_id')->pluck('featured_media_id')->toArray();
                foreach (\App\Models\Project::whereNotNull('gallery_media_ids')->pluck('gallery_media_ids') as $g) {
                    if (is_array($g)) $ids = array_merge($ids, $g);
                }
                break;
            case 'project_content':
                $ids = $this->getContentMediaIds(\App\Models\Project::class);
                break;
            case 'product_gallery':
                $ids = \App\Models\Product::whereNotNull('featured_media_id')->pluck('featured_media_id')->toArray();
                foreach (\App\Models\Product::whereNotNull('gallery_media_ids')->pluck('gallery_media_ids') as $g) {
                    if (is_array($g)) $ids = array_merge($ids, $g);
                }
                break;
            case 'product_icon':
                $ids = \App\Models\Product::whereNotNull('icon')->get()->map(fn($p) => (int)$p->getRawOriginal('icon'))->toArray();
                break;
            case 'product_content':
                $ids = $this->getContentMediaIds(\App\Models\Product::class);
                break;
            case 'article_gallery':
                $ids = \App\Models\Article::whereNotNull('featured_media_id')->pluck('featured_media_id')->toArray();
                foreach (\App\Models\Article::whereNotNull('gallery_media_ids')->pluck('gallery_media_ids') as $g) {
                    if (is_array($g)) $ids = array_merge($ids, $g);
                }
                break;
            case 'article_content':
                $ids = $this->getContentMediaIds(\App\Models\Article::class);
                break;
        }

        return array_values(array_unique(array_filter($ids)));
    }

    private function getContentMediaIds(string $modelClass): array
    {
        $contentFields = ['content', 'content_en'];
        $records = $modelClass::where(function ($q) use ($contentFields) {
            foreach ($contentFields as $field) {
                $q->orWhere($field, 'like', '%<img%');
            }
        })->get($contentFields);

        $paths = [];
        foreach ($records as $record) {
            foreach ($contentFields as $field) {
                $html = $record->$field;
                if (empty($html)) continue;

                preg_match_all('/<img[^>]+src=["\']([^"\']+)["\']/', $html, $matches);
                if (empty($matches[1])) continue;

                foreach ($matches[1] as $src) {
                    $src = trim($src);
                    if (str_starts_with($src, '/storage/')) {
                        $paths[] = substr($src, 9);
                    } elseif (preg_match('#/storage/(uploads/[^\s"\']+)#', $src, $m)) {
                        $paths[] = $m[1];
                    }
                }
            }
        }

        if (empty($paths)) return [];
        return Media::whereIn('path', array_unique($paths))->pluck('id')->toArray();
    }

    public function create()
    {
        return Inertia::render('Admin/Media/Create', [
            'collections' => Media::COLLECTIONS,
        ]);
    }

    public function store(Request $request)
    {
        // Validate non-file fields first
        $request->validate([
            'collection' => 'nullable|string|in:' . implode(',', Media::COLLECTIONS),
            'title'      => 'nullable|string|max:255',
            'folder'     => 'nullable|string|max:100',
            'alt_text'   => 'nullable|string|max:255',
        ]);

        // Manually validate uploaded files from raw $_FILES to avoid is_uploaded_file()
        // issues with PHP built-in server (php artisan serve)
        if (empty($_FILES['files'])) {
            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'The files field is required.',
                    'errors'  => ['files' => ['The files field is required.']],
                ], 422);
            }
            return back()->withErrors(['files' => 'The files field is required.']);
        }

        $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf', 'video/mp4', 'video/webm'];
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'mp4', 'webm'];
        $maxBytes = 10 * 1024 * 1024; // 10MB

        $rawFiles = $_FILES['files'];
        // Normalize to always be array of files
        if (!is_array($rawFiles['name'])) {
            $rawFiles = [
                'name'     => [$rawFiles['name']],
                'type'     => [$rawFiles['type']],
                'tmp_name' => [$rawFiles['tmp_name']],
                'error'    => [$rawFiles['error']],
                'size'     => [$rawFiles['size']],
            ];
        }

        $fileCount = count($rawFiles['name']);
        if ($fileCount < 1 || $fileCount > 20) {
            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'You may upload between 1 and 20 files.',
                    'errors'  => ['files' => ['You may upload between 1 and 20 files.']],
                ], 422);
            }
            return back()->withErrors(['files' => 'You may upload between 1 and 20 files.']);
        }

        // Validate each file
        for ($i = 0; $i < $fileCount; $i++) {
            $error = $rawFiles['error'][$i] ?? UPLOAD_ERR_NO_FILE;
            if ($error !== UPLOAD_ERR_OK) {
                $errMsg = match ($error) {
                    UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => "File \"{$rawFiles['name'][$i]}\" is too large.",
                    default => "File \"{$rawFiles['name'][$i]}\" failed to upload (error {$error}).",
                };
                if ($request->wantsJson()) {
                    return response()->json(['message' => $errMsg, 'errors' => ["files.{$i}" => [$errMsg]]], 422);
                }
                return back()->withErrors(["files.{$i}" => $errMsg]);
            }

            $tmpName = $rawFiles['tmp_name'][$i] ?? '';
            if (empty($tmpName) || !file_exists($tmpName)) {
                $errMsg = "File \"{$rawFiles['name'][$i]}\" could not be found on server.";
                if ($request->wantsJson()) {
                    return response()->json(['message' => $errMsg, 'errors' => ["files.{$i}" => [$errMsg]]], 422);
                }
                return back()->withErrors(["files.{$i}" => $errMsg]);
            }

            $size = $rawFiles['size'][$i] ?? 0;
            if ($size > $maxBytes) {
                $errMsg = "File \"{$rawFiles['name'][$i]}\" exceeds maximum size of 10MB.";
                if ($request->wantsJson()) {
                    return response()->json(['message' => $errMsg, 'errors' => ["files.{$i}" => [$errMsg]]], 422);
                }
                return back()->withErrors(["files.{$i}" => $errMsg]);
            }

            $ext = strtolower(pathinfo($rawFiles['name'][$i], PATHINFO_EXTENSION));
            if (!in_array($ext, $allowedExtensions)) {
                $errMsg = "File \"{$rawFiles['name'][$i]}\" has an unsupported file type.";
                if ($request->wantsJson()) {
                    return response()->json(['message' => $errMsg, 'errors' => ["files.{$i}" => [$errMsg]]], 422);
                }
                return back()->withErrors(["files.{$i}" => $errMsg]);
            }
        }

        // All validations passed — process the uploads
        $collection = $request->input('collection', 'branding');
        $storagePath = 'uploads';
        $customTitle = $request->input('title');

        $uploaded = 0;
        $mediaItems = [];

        for ($i = 0; $i < $fileCount; $i++) {
            $originalName = $rawFiles['name'][$i];
            $tmpName      = $rawFiles['tmp_name'][$i];
            $size         = $rawFiles['size'][$i];
            $extension    = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

            // Determine MIME type using fileinfo
            $finfo    = finfo_open(FILEINFO_MIME_TYPE);
            $mimeType = finfo_file($finfo, $tmpName) ?: ($rawFiles['type'][$i] ?? 'application/octet-stream');
            finfo_close($finfo);

            if ($customTitle) {
                $baseFilename = pathinfo($customTitle, PATHINFO_FILENAME);
                $originalName = $baseFilename . '.' . $extension;
            } else {
                $baseFilename = pathinfo($originalName, PATHINFO_FILENAME);
            }

            $safeName = Str::slug($baseFilename) . '-' . Str::random(6) . '.' . $extension;
            $destPath  = storage_path('app/public/' . $storagePath . '/' . $safeName);

            // Ensure destination directory exists
            if (!is_dir(dirname($destPath))) {
                mkdir(dirname($destPath), 0775, true);
            }

            // Move the uploaded file (works with both Apache and PHP built-in server)
            if (!move_uploaded_file($tmpName, $destPath) && !rename($tmpName, $destPath)) {
                \Illuminate\Support\Facades\Log::error("Failed to move uploaded file: {$tmpName} → {$destPath}");
                continue;
            }

            $relativePath = $storagePath . '/' . $safeName;

            $width = $height = null;
            if (str_starts_with($mimeType, 'image/') && $mimeType !== 'image/svg+xml') {
                try {
                    [$width, $height] = getimagesize($destPath);
                } catch (\Exception $e) {}
            }

            $type = 'document';
            if (str_starts_with($mimeType, 'image/')) $type = 'image';
            elseif (str_starts_with($mimeType, 'video/')) $type = 'video';
            elseif (str_starts_with($mimeType, 'audio/')) $type = 'audio';

            $seoAltText = str_replace(['-', '_'], ' ', $baseFilename);

            $mediaItems[] = Media::create([
                'path'              => $relativePath,
                'filename'          => $safeName,
                'original_filename' => $originalName,
                'mime_type'         => $mimeType,
                'type'              => $type,
                'extension'         => $extension,
                'size'              => $size,
                'disk'              => 'public',
                'collection'        => $collection,
                'folder'            => null,
                'width'             => $width,
                'height'            => $height,
                'title'             => $customTitle,
                'alt_text'          => $seoAltText,
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

    public function rename(Request $request, Media $medium)
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $medium->update(['title' => $request->input('title')]);

        ActivityLogger::logUpdate('Media', $medium->title, $medium);

        return response()->json(['success' => true, 'title' => $medium->title]);
    }

    public function destroy(Request $request, Media $medium)
    {
        $usageService = new MediaUsageService();
        $usageService->loadUsages([$medium->id]);
        $usages = $usageService->getUsage($medium->id);

        if (!empty($usages)) {
            $refs = implode(', ', array_map(fn($u) => "\"{$u['entity']}\" ({$u['label']})", $usages));
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => "Tidak dapat memadam imej. Digunakan oleh: {$refs}. Sila buang semua rujukan sebelum memadam.",
                    'refs' => $refs,
                ], 422);
            }
            return back()->with('error', "Tidak dapat memadam imej. Digunakan oleh: {$refs}. Sila buang semua rujukan sebelum memadam.");
        }

        if (Storage::disk($medium->disk)->exists($medium->path)) {
            Storage::disk($medium->disk)->delete($medium->path);
        }
        if ($medium->thumbnail_path && Storage::disk($medium->disk)->exists($medium->thumbnail_path)) {
            Storage::disk($medium->disk)->delete($medium->thumbnail_path);
        }

        $mediaName = $medium->original_filename;
        $medium->delete();

        ActivityLogger::logDelete('Media', $mediaName);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Media berjaya dipadam.'
            ]);
        }

        return redirect()->route('admin.media.index')
            ->with('success', 'Media berjaya dipadam.');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids'   => 'required|array|min:1',
            'ids.*' => 'integer|exists:media,id',
        ]);

        $ids = $request->input('ids');
        $usageService = new MediaUsageService();
        $usageService->loadUsages($ids);

        $blocked = [];
        $allowed = [];

        foreach ($ids as $id) {
            $usages = $usageService->getUsage($id);
            if (!empty($usages)) {
                $blocked[] = $id;
            } else {
                $allowed[] = $id;
            }
        }

        $items = Media::whereIn('id', $allowed)->get();
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

        $msg = '';
        if ($deletedCount > 0) {
            $msg .= "{$deletedCount} fail berjaya dipadam.";
        }
        if (!empty($blocked)) {
            $msg .= ' ' . count($blocked) . ' imej tidak dapat dipadam kerana masih digunakan.';
        }

        return response()->json([
            'success' => true,
            'deleted' => $deletedCount,
            'blocked' => count($blocked),
            'message' => trim($msg),
        ]);
    }
}
