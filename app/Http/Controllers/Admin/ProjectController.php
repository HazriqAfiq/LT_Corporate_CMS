<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::query();

        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('client', 'like', "%{$search}%");
        }

        $projects = $query->orderBy('order')->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'filters'  => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Projects/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'               => 'required|string|max:255',
            'title_en'            => 'nullable|string|max:255',
            'client'              => 'nullable|string|max:255',
            'category'            => 'nullable|string',
            'url'                 => 'nullable|url',
            'description'         => 'nullable|string',
            'description_en'      => 'nullable|string',
            'content'             => 'nullable|string',
            'content_en'          => 'nullable|string',
            'testimonial'         => 'nullable|string',
            'testimonial_en'      => 'nullable|string',
            'testimonial_author'  => 'nullable|string',
            'featured_image'      => 'nullable|image|max:5120',
            'gallery_images'      => 'nullable|array|max:15',
            'gallery_images.*'    => 'image|max:5120',
            'technologies'        => 'nullable|array',
            'is_published'        => 'boolean',
            'is_featured'         => 'boolean',
            'completed_at'        => 'nullable|date',
            'order'               => 'integer',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('projects', 'public');
        }

        $galleryPaths = [];
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $img) {
                $galleryPaths[] = $img->store('projects/gallery', 'public');
            }
        }
        $validated['images'] = !empty($galleryPaths) ? $galleryPaths : null;
        unset($validated['gallery_images']);

        Project::create($validated);

        return redirect()->route('admin.projects.index')
            ->with('success', 'Projek berjaya ditambah.');
    }

    public function edit(Project $project)
    {
        return Inertia::render('Admin/Projects/Edit', [
            'project' => $project,
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title'               => 'required|string|max:255',
            'title_en'            => 'nullable|string|max:255',
            'client'              => 'nullable|string|max:255',
            'category'            => 'nullable|string',
            'url'                 => 'nullable|url',
            'description'         => 'nullable|string',
            'description_en'      => 'nullable|string',
            'content'             => 'nullable|string',
            'content_en'          => 'nullable|string',
            'testimonial'         => 'nullable|string',
            'testimonial_en'      => 'nullable|string',
            'testimonial_author'  => 'nullable|string',
            'featured_image'      => 'nullable|image|max:5120',
            'gallery_images'      => 'nullable|array|max:15',
            'gallery_images.*'    => 'image|max:5120',
            'keep_gallery'        => 'nullable|array',
            'keep_gallery.*'      => 'string',
            'technologies'        => 'nullable|array',
            'is_published'        => 'boolean',
            'is_featured'         => 'boolean',
            'completed_at'        => 'nullable|date',
            'order'               => 'integer',
        ]);

        if ($validated['title'] !== $project->title) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if ($request->hasFile('featured_image')) {
            if ($project->featured_image && Storage::disk('public')->exists($project->featured_image)) {
                Storage::disk('public')->delete($project->featured_image);
            }
            $validated['featured_image'] = $request->file('featured_image')->store('projects', 'public');
        }

        // Gallery management
        $keepGallery = $request->input('keep_gallery', []);
        $existingGallery = $project->images ?? [];
        $removedPaths = array_diff($existingGallery, $keepGallery);
        foreach ($removedPaths as $path) {
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }

        $newPaths = [];
        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $img) {
                $newPaths[] = $img->store('projects/gallery', 'public');
            }
        }

        $mergedGallery = array_merge($keepGallery, $newPaths);
        $validated['images'] = !empty($mergedGallery) ? $mergedGallery : null;
        unset($validated['gallery_images'], $validated['keep_gallery']);

        $project->update($validated);

        return redirect()->route('admin.projects.index')
            ->with('success', 'Projek berjaya dikemaskini.');
    }

    public function destroy(Project $project)
    {
        if ($project->featured_image && Storage::disk('public')->exists($project->featured_image)) {
            Storage::disk('public')->delete($project->featured_image);
        }
        foreach ($project->images ?? [] as $path) {
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }

        $project->delete();

        return redirect()->route('admin.projects.index')
            ->with('success', 'Projek berjaya dipadam.');
    }
}
