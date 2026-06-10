<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware;

class ServiceController extends Controller implements HasMiddleware
{
    use HasResourcePermissions;

    protected static string $permissionPrefix = 'services';

    public function index(Request $request)
    {
        $query = Service::query()->with('featuredMedia');

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->input('is_active') === 'true');
        }

        $services = $query->orderBy('order')->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Services/Index', [
            'services' => $services,
            'filters'  => $request->only(['search', 'is_active']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Services/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'name_en'          => 'nullable|string|max:255',
            'description'      => 'nullable|string',
            'description_en'   => 'nullable|string',
            'content'          => 'nullable|string',
            'content_en'       => 'nullable|string',
            'features'         => 'nullable|array',
            'features_en'      => 'nullable|array',
            'order'            => 'integer',
            'is_active'        => 'boolean',
            'icon'             => 'nullable|string|max:255',
            'featured_media_id'   => 'nullable|exists:media,id',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        // Ensure unique slug
        $slugBase = $validated['slug'];
        $count = 1;
        while (Service::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $slugBase . '-' . $count++;
        }

        $service = Service::create($validated);

        ActivityLogger::logCreate('Perkhidmatan', $service->name, $service);

        return redirect()->route('admin.services.index')
            ->with('success', 'Perkhidmatan berjaya ditambah.');
    }

    public function edit(Service $service)
    {
        $service->load(['featuredMedia']);
        return Inertia::render('Admin/Services/Edit', [
            'service' => $service,
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'name_en'          => 'nullable|string|max:255',
            'description'      => 'nullable|string',
            'description_en'   => 'nullable|string',
            'content'          => 'nullable|string',
            'content_en'       => 'nullable|string',
            'features'         => 'nullable|array',
            'features_en'      => 'nullable|array',
            'order'            => 'integer',
            'is_active'        => 'boolean',
            'icon'             => 'nullable|string|max:255',
            'featured_media_id'   => 'nullable|exists:media,id',
        ]);

        if ($validated['name'] !== $service->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $service->update($validated);

        ActivityLogger::logUpdate('Perkhidmatan', $service->name, $service);

        return back()
            ->with('success', 'Perkhidmatan berjaya dikemaskini.');
    }

    public function destroy(Service $service)
    {
        $serviceName = $service->name;
        $service->delete();

        ActivityLogger::logDelete('Perkhidmatan', $serviceName);

        return redirect()->route('admin.services.index')
            ->with('success', 'Perkhidmatan berjaya dipadam.');
    }
}
