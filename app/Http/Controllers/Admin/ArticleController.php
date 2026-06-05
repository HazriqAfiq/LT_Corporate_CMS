<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Http\Controllers\Admin\HasResourcePermissions;

class ArticleController extends Controller implements HasMiddleware
{
    use HasResourcePermissions;

    protected static string $permissionPrefix = 'articles';

    public function index(Request $request)
    {
        $query = Article::query()->with(['author', 'featuredMedia']);

        $user = auth()->user();
        if (!$user->hasRole('Super Admin') && $user->hasPermissionTo('manage_own_articles')) {
            $query->where('author_id', $user->id);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('title_en', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            if ($status === 'published') {
                $query->where('is_published', true)->where('is_archived', false)->where('published_at', '<=', now());
            } elseif ($status === 'scheduled') {
                $query->where('is_published', true)->where('is_archived', false)->where('published_at', '>', now());
            } elseif ($status === 'draft') {
                $query->where('is_published', false)->where('is_archived', false);
            } elseif ($status === 'archived') {
                $query->where('is_archived', true);
            }
        }

        $articles = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Articles/Index', [
            'articles' => $articles,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        // Handled by HasResourcePermissions middleware
        return Inertia::render('Admin/Articles/Create');
    }

    public function store(Request $request)
    {
        // Handled by HasResourcePermissions middleware
        $rules = [
            'title' => 'required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'category' => 'nullable|string|in:berita,teknologi,tips,pengumuman,kajian-kes',
            'excerpt' => 'required|string',
            'excerpt_en' => 'nullable|string',
            'content' => 'required|string',
            'content_en' => 'nullable|string',
            'featured_media_id' => 'nullable|exists:media,id',
            'is_published' => 'boolean',
            'is_archived' => 'boolean',
            'publish_immediately' => 'nullable|boolean',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ];

        $isDraft = !filter_var($request->input('is_published', true), FILTER_VALIDATE_BOOLEAN);
        if ($isDraft) {
            $rules['excerpt'] = 'nullable|string';
            $rules['content'] = 'nullable|string';
        }

        $validated = $request->validate($rules);

        if ($isDraft) {
            if (!isset($validated['content']) || is_null($validated['content'])) {
                $validated['content'] = '';
            }
            if (!isset($validated['excerpt']) || is_null($validated['excerpt'])) {
                $validated['excerpt'] = '';
            }
        }

        $validated['is_published'] = filter_var($request->input('is_published', true), FILTER_VALIDATE_BOOLEAN);
        $validated['is_archived'] = false;

        if ($validated['is_published']) {
            $publishedAt = !empty($validated['published_at']) ? \Carbon\Carbon::parse($validated['published_at']) : null;
            if (!empty($validated['publish_immediately']) || empty($validated['published_at']) || ($publishedAt && $publishedAt->isPast())) {
                $validated['published_at'] = now();
            }
        } else {
            $validated['published_at'] = null;
        }

        $validated['slug'] = Article::generateUniqueSlug($validated['title']);
        $validated['author_id'] = auth()->id();



        $article = Article::create($validated);

        ActivityLogger::logCreate('Artikel', $article->title, $article);

        return redirect()->route('admin.articles.index')->with('success', 'Article created successfully.');
    }

    public function edit(Article $article)
    {
        $user = auth()->user();
        if (!$user->hasRole('Super Admin')) {
            if ($user->hasPermissionTo('manage_own_articles')) {
                abort_if($article->author_id !== $user->id, 403, 'Unauthorized.');
            } else {
                abort_if(!$user->hasPermissionTo('edit_articles'), 403, 'Unauthorized.');
            }
        }

        $article->load('featuredMedia');
        return Inertia::render('Admin/Articles/Edit', [
            'article' => $article->append('featuredMedia'),
        ]);
    }

    public function update(Request $request, Article $article)
    {
        $user = auth()->user();
        if (!$user->hasRole('Super Admin')) {
            if ($user->hasPermissionTo('manage_own_articles')) {
                abort_if($article->author_id !== $user->id, 403, 'Unauthorized.');
            } else {
                abort_if(!$user->hasPermissionTo('edit_articles'), 403, 'Unauthorized.');
            }
        }

        $rules = [
            'title' => 'required|string|max:255',
            'title_en' => 'nullable|string|max:255',
            'category' => 'nullable|string|in:berita,teknologi,tips,pengumuman,kajian-kes',
            'excerpt' => 'required|string',
            'excerpt_en' => 'nullable|string',
            'content' => 'required|string',
            'content_en' => 'nullable|string',
            'featured_media_id' => 'nullable|exists:media,id',
            'is_published' => 'boolean',
            'is_archived' => 'boolean',
            'publish_immediately' => 'nullable|boolean',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ];

        $isDraft = !filter_var($request->input('is_published', true), FILTER_VALIDATE_BOOLEAN);
        if ($isDraft) {
            $rules['excerpt'] = 'nullable|string';
            $rules['content'] = 'nullable|string';
        }

        $validated = $request->validate($rules);

        if ($isDraft) {
            if (!isset($validated['content']) || is_null($validated['content'])) {
                $validated['content'] = '';
            }
            if (!isset($validated['excerpt']) || is_null($validated['excerpt'])) {
                $validated['excerpt'] = '';
            }
        }

        if ($isDraft) {
            $validated['is_published'] = false;
            $validated['is_archived'] = false;
            $validated['published_at'] = null;
        } else {
            if (isset($validated['is_archived'])) {
                $validated['is_published'] = !$validated['is_archived'];
            } else {
                $validated['is_published'] = true;
                $validated['is_archived'] = false;
            }

            // Lock published_at if already posted
            $isAlreadyPosted = $article->is_published && $article->published_at && $article->published_at->isPast();
            if ($isAlreadyPosted) {
                unset($validated['published_at']);
            } else {
                $publishedAt = !empty($validated['published_at']) ? \Carbon\Carbon::parse($validated['published_at']) : null;
                if (!empty($validated['publish_immediately']) || empty($validated['published_at']) || ($publishedAt && $publishedAt->isPast())) {
                    $validated['published_at'] = now();
                    $validated['publish_immediately'] = true;
                }
            }
        }

        if ($validated['title'] !== $article->title) {
            $validated['slug'] = Article::generateUniqueSlug($validated['title'], $article->id);
        }



        $article->update($validated);

        ActivityLogger::logUpdate('Artikel', $article->title, $article);

        return back()->with('success', 'Article updated successfully.');
    }

    public function destroy(Article $article)
    {
        $user = auth()->user();
        if (!$user->hasRole('Super Admin')) {
            if ($user->hasPermissionTo('manage_own_articles')) {
                abort_if($article->author_id !== $user->id, 403, 'Unauthorized.');
            } else {
                abort_if(!$user->hasPermissionTo('delete_articles'), 403, 'Unauthorized.');
            }
        }

        $title = $article->title;
        $article->delete();

        ActivityLogger::logDelete('Artikel', $title);

        return redirect()->route('admin.articles.index')->with('success', 'Article deleted successfully.');
    }
}
