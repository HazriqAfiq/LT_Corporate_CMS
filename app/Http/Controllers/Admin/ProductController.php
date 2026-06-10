<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware;

class ProductController extends Controller implements HasMiddleware
{
    use HasResourcePermissions;

    protected static string $permissionPrefix = 'products';



    public function index(Request $request)
    {
        $query = Product::query()->with('featuredMedia');

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->input('is_active') === 'true');
        }

        $products = $query->orderBy('order')->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'filters'  => $request->only(['search', 'is_active']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'name_en'          => 'nullable|string|max:255',
            'category'         => 'nullable|string',
            'description'      => 'nullable|string',
            'description_en'   => 'nullable|string',
            'content'          => 'nullable|string',
            'content_en'       => 'nullable|string',
            'features'         => 'nullable|array',
            'features_en'      => 'nullable|array',
            'price'            => 'nullable|string',
            'demo_url'         => 'nullable|url',
            'order'            => 'integer',
            'is_active'        => 'boolean',
            'is_featured'      => 'boolean',
            'meta_title'       => 'nullable|string',
            'meta_description' => 'nullable|string',
            'icon'             => 'nullable',
            'featured_media_id'   => 'nullable|exists:media,id',
            'gallery_media_ids'   => 'nullable|array',
            'gallery_media_ids.*' => 'integer|exists:media,id',
        ]);


        $validated['slug'] = Str::slug($validated['name']);

        if ($request->hasFile('icon')) {
            $file = $request->file('icon');
            $path = $file->store('uploads', 'public');
            
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
                'collection' => 'products',
                'uploaded_by' => auth()->id(),
            ]);

            $validated['icon'] = $path;
        }

        if (empty($validated['featured_media_id']) && !empty($validated['gallery_media_ids'])) {
            $validated['featured_media_id'] = $validated['gallery_media_ids'][0];
        }

        $product = Product::create($validated);

        ActivityLogger::logCreate('Produk', $product->name, $product);

        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berjaya ditambah.');
    }

    public function edit(Product $product)
    {
        $product->load(['featuredMedia', 'iconMedia']);
        $galleryMedia = [];
        if ($product->gallery_media_ids && is_array($product->gallery_media_ids)) {
            $galleryMedia = \App\Models\Media::whereIn('id', $product->gallery_media_ids)->get()->toArray();
        }
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product->append(['featuredMedia', 'iconMedia']),
            'galleryMedia' => $galleryMedia,
        ]);
    }


    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'name_en'          => 'nullable|string|max:255',
            'category'         => 'nullable|string',
            'description'      => 'nullable|string',
            'description_en'   => 'nullable|string',
            'content'          => 'nullable|string',
            'content_en'       => 'nullable|string',
            'features'         => 'nullable|array',
            'features_en'      => 'nullable|array',
            'price'            => 'nullable|string',
            'demo_url'         => 'nullable|url',
            'order'            => 'integer',
            'is_active'        => 'boolean',
            'is_featured'      => 'boolean',
            'meta_title'       => 'nullable|string',
            'meta_description' => 'nullable|string',
            'icon'             => 'nullable',
            'featured_media_id'   => 'nullable|exists:media,id',
            'gallery_media_ids'   => 'nullable|array',
            'gallery_media_ids.*' => 'integer|exists:media,id',
        ]);


        if ($validated['name'] !== $product->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if ($request->hasFile('icon')) {
            // Delete old icon from disk & media library
            if ($product->icon) {
                $oldMedia = \App\Models\Media::where('path', $product->icon)->first();
                if ($oldMedia) {
                    $oldMedia->delete();
                }
                if (Storage::disk('public')->exists($product->icon)) {
                    Storage::disk('public')->delete($product->icon);
                }
            }
            
            $file = $request->file('icon');
            $path = $file->store('uploads', 'public');
            
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
                'collection' => 'products',
                'uploaded_by' => auth()->id(),
            ]);

            $validated['icon'] = $path;
        }

        if (empty($validated['featured_media_id']) && !empty($validated['gallery_media_ids'])) {
            $validated['featured_media_id'] = $validated['gallery_media_ids'][0];
        }

        $product->update($validated);

        ActivityLogger::logUpdate('Produk', $product->name, $product);

        return back()
            ->with('success', 'Produk berjaya dikemaskini.');
    }

    public function destroy(Product $product)
    {
        // Clean up icons only (icon is still handled via direct upload in the legacy way for now if it exists, wait, we probably should move icon to media too but the plan didn't say so).
        if ($product->icon) {
            $oldMedia = \App\Models\Media::where('path', $product->icon)->first();
            if ($oldMedia) {
                $oldMedia->delete();
            }
            if (Storage::disk('public')->exists($product->icon)) {
                Storage::disk('public')->delete($product->icon);
            }
        }

        $productName = $product->name;
        $product->delete();

        ActivityLogger::logDelete('Produk', $productName);

        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berjaya dipadam.');
    }
}
