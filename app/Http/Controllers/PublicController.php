<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ContactInquiry;
use App\Models\NewsletterSubscriber;
use App\Models\Product;
use App\Models\Project;
use App\Models\Setting;
use App\Models\Slider;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    private function sharedData(): array
    {
        $settings = [];
        if (\Illuminate\Support\Facades\Schema::hasTable('settings')) {
            $settingsData = Setting::with('media')->get();
            foreach ($settingsData as $setting) {
                if ($setting->type === 'image') {
                    if ($setting->media) {
                        $settings[$setting->key] = $setting->media->url;
                    } else {
                        $value = $setting->value;
                        if ($value) {
                            $settings[$setting->key] = (str_starts_with($value, 'http') || str_starts_with($value, '/storage') || str_starts_with($value, 'storage'))
                                ? (str_starts_with($value, '/storage') || str_starts_with($value, 'http') ? $value : '/storage/' . $value)
                                : '/storage/' . $value;
                        } else {
                            $settings[$setting->key] = null;
                        }
                    }
                } else {
                    $settings[$setting->key] = $setting->value;
                }
            }
        }

        return [
            'settings' => $settings,
        ];
    }

    /**
     * Homepage
     */
    public function home()
    {
        return Inertia::render('Public/Home', array_merge($this->sharedData(), [
            'sliders' => Slider::active()->ordered()->with('media')->get(),
            'services' => \App\Models\Service::active()->ordered()->with('featuredMedia')->take(6)->get(),
            'featuredProducts' => Product::active()->featured()->ordered()->with('featuredMedia')->take(6)->get(),
            'featuredProjects' => Project::published()->featured()->ordered()->with('featuredMedia')->take(4)->get(),
            'latestArticles' => Article::published()->latest('published_at')->with(['featuredMedia', 'author'])->take(3)->get()->map(fn ($a) => [
                ...$a->toArray(),
                'author_name' => $a->author?->name,
            ]),
        ]));
    }

    /**
     * About page
     */
    public function about()
    {
        return Inertia::render('Public/About', array_merge($this->sharedData(), [
            'team' => \App\Models\TeamMember::active()->ordered()->with('profileMedia')->get(),
        ]));
    }

    /**
     * Services page
     */
    public function services()
    {
        return Inertia::render('Public/Services', array_merge($this->sharedData(), [
            'services' => \App\Models\Service::active()->ordered()->with('featuredMedia')->take(6)->get(),
        ]));
    }

    /**
     * Service detail page
     */
    public function serviceDetail(string $slug)
    {
        $service = \App\Models\Service::where('slug', $slug)
            ->where('is_active', true)
            ->with('featuredMedia')
            ->firstOrFail();

        return Inertia::render('Public/ServiceDetail', array_merge($this->sharedData(), [
            'service' => $service,
        ]));
    }

    /**
     * Products listing
     */
    public function products()
    {
        return Inertia::render('Public/Products', array_merge($this->sharedData(), [
            'products' => Product::active()->with('featuredMedia')->ordered()->get(),
        ]));
    }

    /**
     * Product detail
     */
    public function productDetail(string $slug)
    {
        $product = Product::where('slug', $slug)->where('is_active', true)->with('featuredMedia')->firstOrFail();
        
        // Prevent double counting views from refreshes in the same session
        $sessionKey = 'viewed_product_' . $product->id;
        if (!session()->has($sessionKey)) {
            $product->incrementViews();
            session()->put($sessionKey, true);
        }
        
        $galleryMedia = [];
        if ($product->gallery_media_ids && is_array($product->gallery_media_ids)) {
            $galleryMedia = \App\Models\Media::whereIn('id', $product->gallery_media_ids)->get();
        }

        return Inertia::render('Public/ProductDetail', array_merge($this->sharedData(), [
            'product' => $product,
            'galleryMedia' => $galleryMedia,
        ]));
    }

    /**
     * Portfolio listing
     */
    public function portfolio()
    {
        return Inertia::render('Public/Portfolio', array_merge($this->sharedData(), [
            'projects' => Project::published()->ordered()->with('featuredMedia')->get(),
        ]));
    }

    /**
     * Portfolio detail
     */
    public function portfolioDetail(string $slug)
    {
        $project = Project::where('slug', $slug)->where('is_published', true)->with('featuredMedia')->firstOrFail();
        
        // Prevent double counting views from refreshes in the same session
        $sessionKey = 'viewed_project_' . $project->id;
        if (!session()->has($sessionKey)) {
            $project->incrementViews();
            session()->put($sessionKey, true);
        }
        
        $galleryMedia = [];
        if ($project->gallery_media_ids && is_array($project->gallery_media_ids)) {
            $galleryMedia = \App\Models\Media::whereIn('id', $project->gallery_media_ids)->get();
        }
        
        return Inertia::render('Public/PortfolioDetail', array_merge($this->sharedData(), [
            'project' => $project,
            'galleryMedia' => $galleryMedia,
        ]));
    }

    /**
     * Articles listing
     */
    public function articles(Request $request)
    {
        $query = Article::published()->latest('published_at')->with(['featuredMedia', 'author']);

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $articles = $query->paginate(9)->through(fn ($a) => [
            ...$a->toArray(),
            'author_name' => $a->author?->name,
        ]);

        if (($request->wantsJson() || $request->ajax()) && !$request->hasHeader('X-Inertia')) {
            return response()->json($articles);
        }

        return Inertia::render('Public/Articles', array_merge($this->sharedData(), [
            'articles' => $articles,
            'currentCategory' => $request->category,
        ]));
    }

    /**
     * Article detail
     */
    public function articleDetail(string $slug)
    {
        $article = Article::published()->where('slug', $slug)->with(['featuredMedia', 'author'])->firstOrFail();
        
        // Prevent double counting views from refreshes in the same session
        $sessionKey = 'viewed_article_' . $article->id;
        if (!session()->has($sessionKey)) {
            $article->incrementViews();
            session()->put($sessionKey, true);
        }

        $related = Article::published()
            ->where('id', '!=', $article->id)
            ->where('category', $article->category)
            ->with('featuredMedia')
            ->latest('published_at')
            ->take(3)
            ->get();

        $galleryMedia = [];
        if ($article->gallery_media_ids && is_array($article->gallery_media_ids)) {
            $galleryMedia = \App\Models\Media::whereIn('id', $article->gallery_media_ids)->get();
        }

        return Inertia::render('Public/ArticleDetail', array_merge($this->sharedData(), [
            'article' => [
                ...$article->toArray(),
                'author_name' => $article->author?->name,
            ],
            'galleryMedia' => $galleryMedia,
            'relatedArticles' => $related,
        ]));
    }

    /**
     * Contact page
     */
    public function contact()
    {
        return Inertia::render('Public/Contact', $this->sharedData());
    }

    /**
     * Contact form submission
     */
    public function contactSubmit(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        $inquiry = ContactInquiry::create($validated);

        ActivityLogger::log('create', "Pertanyaan baharu diterima dari: \"{$inquiry->name}\"", $inquiry);
    }

    /**
     * Newsletter subscribe (public AJAX endpoint)
     */
    public function newsletterSubscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
            'name'  => 'nullable|string|max:255',
        ]);

        $existing = NewsletterSubscriber::where('email', $validated['email'])->first();

        if ($existing) {
            if ($existing->is_active) {
                return response()->json([
                    'success' => false,
                    'already' => true,
                    'message' => 'Email ini telah pun melanggan.',
                ], 409);
            }
            // Re-activate if previously unsubscribed
            $existing->update([
                'is_active'       => true,
                'subscribed_at'   => now(),
                'unsubscribed_at' => null,
                'name'            => $validated['name'] ?? $existing->name,
            ]);
            return response()->json(['success' => true]);
        }

        NewsletterSubscriber::create([
            'email'         => $validated['email'],
            'name'          => $validated['name'] ?? null,
            'is_active'     => true,
            'subscribed_at' => now(),
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * Privacy Policy page
     */
    public function privacy()
    {
        return Inertia::render('Public/Privacy', $this->sharedData());
    }

    /**
     * Terms & Conditions page
     */
    public function terms()
    {
        return Inertia::render('Public/Terms', $this->sharedData());
    }

    /**
     * Visual Sitemap page
     */
    public function sitemapVisual()
    {
        return Inertia::render('Public/SitemapVisual', $this->sharedData());
    }

    /**
     * Generate XML Sitemap
     */
    public function sitemap()
    {
        $products = Product::active()->get();
        $projects = Project::published()->get();
        $articles = Article::published()->get();

        return response()->view('sitemap', [
            'products' => $products,
            'projects' => $projects,
            'articles' => $articles,
        ])->header('Content-Type', 'text/xml');
    }
}


