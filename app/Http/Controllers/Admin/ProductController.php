<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

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
            'icon'             => 'nullable|image|max:1024',
            'featured_image'   => 'nullable|image|max:5120',
            'gallery_images'   => 'nullable|array|max:10',
            'gallery_images.*' => 'image|max:5120',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        if ($request->hasFile('icon')) {
            $validated['icon'] = $request->file('icon')->store('products/icons', 'public');
        }

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('products', 'public');
        }

        $galleryPaths = [];
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $img) {
                $galleryPaths[] = $img->store('products/gallery', 'public');
            }
        }
        $validated['gallery_images'] = $galleryPaths ?: null;

        Product::create($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berjaya ditambah.');
    }

    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
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
            'icon'             => 'nullable|image|max:1024',
            'featured_image'   => 'nullable|image|max:5120',
            'gallery_images'   => 'nullable|array|max:10',
            'gallery_images.*' => 'image|max:5120',
            // Existing gallery paths to keep (stringified paths from frontend)
            'keep_gallery'     => 'nullable|array',
            'keep_gallery.*'   => 'string',
        ]);

        if ($validated['name'] !== $product->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if ($request->hasFile('icon')) {
            if ($product->icon && Storage::disk('public')->exists($product->icon)) {
                Storage::disk('public')->delete($product->icon);
            }
            $validated['icon'] = $request->file('icon')->store('products/icons', 'public');
        }

        if ($request->hasFile('featured_image')) {
            if ($product->featured_image && Storage::disk('public')->exists($product->featured_image)) {
                Storage::disk('public')->delete($product->featured_image);
            }
            $validated['featured_image'] = $request->file('featured_image')->store('products', 'public');
        }

        // Merge kept existing gallery images with new uploads
        $keepGallery = $request->input('keep_gallery', []);

        // Delete removed gallery images from disk
        $existingGallery = $product->gallery_images ?? [];
        $removedPaths = array_diff($existingGallery, $keepGallery);
        foreach ($removedPaths as $removedPath) {
            if (Storage::disk('public')->exists($removedPath)) {
                Storage::disk('public')->delete($removedPath);
            }
        }

        $newGalleryPaths = [];
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $img) {
                $newGalleryPaths[] = $img->store('products/gallery', 'public');
            }
        }

        $mergedGallery = array_merge($keepGallery, $newGalleryPaths);
        $validated['gallery_images'] = !empty($mergedGallery) ? $mergedGallery : null;

        unset($validated['keep_gallery']);

        $product->update($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berjaya dikemaskini.');
    }

    public function destroy(Product $product)
    {
        // Clean up images from disk
        if ($product->featured_image && Storage::disk('public')->exists($product->featured_image)) {
            Storage::disk('public')->delete($product->featured_image);
        }
        if ($product->icon && Storage::disk('public')->exists($product->icon)) {
            Storage::disk('public')->delete($product->icon);
        }
        foreach ($product->gallery_images ?? [] as $path) {
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berjaya dipadam.');
    }
}
