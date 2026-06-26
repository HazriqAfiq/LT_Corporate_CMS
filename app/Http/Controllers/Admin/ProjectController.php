<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware;

class ProjectController extends Controller implements HasMiddleware
{
    use HasResourcePermissions;

    protected static string $permissionPrefix = 'projects';

    public function index(Request $request)
    {
        $query = Project::query()->with('featuredMedia');

        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('client', 'like', "%{$search}%");
        }

        $projects = $query->orderBy('completed_at', 'desc')->latest()->paginate(10)->withQueryString();

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
            'featured_media_id'   => 'nullable|exists:media,id',
            'gallery_media_ids'   => 'nullable|array',
            'gallery_media_ids.*' => 'integer|exists:media,id',
            'technologies'        => 'nullable|array',
            'technologies_en'     => 'nullable|array',
            'is_published'        => 'boolean',
            'is_featured'         => 'boolean',
            'completed_at'        => 'nullable|date',
        ]);

        $validated['slug'] = Project::generateUniqueSlug($validated['title']);

        if (!empty($validated['gallery_media_ids'])) {
            if (empty($validated['featured_media_id']) || !in_array($validated['featured_media_id'], $validated['gallery_media_ids'])) {
                $validated['featured_media_id'] = $validated['gallery_media_ids'][0];
            }
        } else {
            $validated['featured_media_id'] = null;
        }

        $project = Project::create($validated);

        ActivityLogger::logCreate('Projek', $project->title, $project);

        return redirect()->route('admin.projects.index')
            ->with('success', 'Projek berjaya ditambah.');
    }

    public function edit(Project $project)
    {
        $project->load(['featuredMedia']);
        $galleryMedia = [];
        if ($project->gallery_media_ids && is_array($project->gallery_media_ids)) {
            $galleryMedia = \App\Models\Media::whereIn('id', $project->gallery_media_ids)->get()->toArray();
        }
        return Inertia::render('Admin/Projects/Edit', [
            'project' => $project->append(['featuredMedia']),
            'galleryMedia' => $galleryMedia,
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
            'featured_media_id'   => 'nullable|exists:media,id',
            'gallery_media_ids'   => 'nullable|array',
            'gallery_media_ids.*' => 'integer|exists:media,id',
            'technologies'        => 'nullable|array',
            'technologies_en'     => 'nullable|array',
            'is_published'        => 'boolean',
            'is_featured'         => 'boolean',
            'completed_at'        => 'nullable|date',
        ]);

        if ($validated['title'] !== $project->title) {
            $validated['slug'] = Project::generateUniqueSlug($validated['title'], $project->id);
        }

        if (!empty($validated['gallery_media_ids'])) {
            if (empty($validated['featured_media_id']) || !in_array($validated['featured_media_id'], $validated['gallery_media_ids'])) {
                $validated['featured_media_id'] = $validated['gallery_media_ids'][0];
            }
        } else {
            $validated['featured_media_id'] = null;
        }

        $project->update($validated);

        ActivityLogger::logUpdate('Projek', $project->title, $project);

        return back()
            ->with('success', 'Projek berjaya dikemaskini.');
    }

    public function destroy(Project $project)
    {


        $projectTitle = $project->title;
        $project->delete();

        ActivityLogger::logDelete('Projek', $projectTitle);

        return redirect()->route('admin.projects.index')
            ->with('success', 'Projek berjaya dipadam.');
    }
}
