<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ContactInquiry;
use App\Models\Product;
use App\Models\Project;
use App\Models\Setting;
use App\Models\Slider;
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
        return Inertia::render('Public/Services', $this->sharedData());
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
        return Inertia::render('Public/PortfolioDetail', array_merge($this->sharedData(), [
            'project' => $project,
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

        return Inertia::render('Public/Articles', array_merge($this->sharedData(), [
            'articles' => $query->paginate(9)->through(fn ($a) => [
                ...$a->toArray(),
                'author_name' => $a->author?->name,
            ]),
            'currentCategory' => $request->category,
        ]));
    }

    /**
     * Article detail
     */
    public function articleDetail(string $slug)
    {
        $article = Article::where('slug', $slug)->where('is_published', true)->with(['featuredMedia', 'author'])->firstOrFail();
        $article->incrementViews();

        $related = Article::published()
            ->where('id', '!=', $article->id)
            ->where('category', $article->category)
            ->with('featuredMedia')
            ->latest('published_at')
            ->take(3)
            ->get();

        return Inertia::render('Public/ArticleDetail', array_merge($this->sharedData(), [
            'article' => [
                ...$article->toArray(),
                'author_name' => $article->author?->name,
            ],
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

        ContactInquiry::create($validated);
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


