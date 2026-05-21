<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;

// Public Website Routes
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/tentang-kami', [PublicController::class, 'about'])->name('about');
Route::get('/perkhidmatan', [PublicController::class, 'services'])->name('services');
Route::get('/produk', [PublicController::class, 'products'])->name('products');
Route::get('/produk/{slug}', [PublicController::class, 'productDetail'])->name('products.detail');
Route::get('/portfolio', [PublicController::class, 'portfolio'])->name('portfolio');
Route::get('/portfolio/{slug}', [PublicController::class, 'portfolioDetail'])->name('portfolio.detail');
Route::get('/artikel', [PublicController::class, 'articles'])->name('articles');
Route::get('/artikel/{slug}', [PublicController::class, 'articleDetail'])->name('articles.detail');
Route::get('/hubungi-kami', [PublicController::class, 'contact'])->name('contact');
Route::post('/hubungi-kami', [PublicController::class, 'contactSubmit'])->name('contact.submit');
Route::get('/dasar-privasi', [PublicController::class, 'privacy'])->name('privacy');
Route::get('/terma-syarat', [PublicController::class, 'terms'])->name('terms');
Route::get('/peta-laman', [PublicController::class, 'sitemapVisual'])->name('sitemap.visual');
Route::get('/sitemap.xml', [PublicController::class, 'sitemap'])->name('sitemap');
Route::get('/halaman/{slug}', [PublicController::class, 'customPage'])->name('pages.show');


// Auth Routes (Breeze) & Admin
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', function () {
        return redirect()->route('admin.dashboard');
    })->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
        Route::resource('articles', \App\Http\Controllers\Admin\ArticleController::class);
        Route::resource('projects', \App\Http\Controllers\Admin\ProjectController::class);
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
        Route::resource('settings', \App\Http\Controllers\Admin\SettingController::class);
        Route::resource('media', \App\Http\Controllers\Admin\MediaController::class);
        Route::resource('pages', \App\Http\Controllers\Admin\PageController::class);
        Route::resource('products', \App\Http\Controllers\Admin\ProductController::class);
        Route::resource('seo-settings', \App\Http\Controllers\Admin\SeoSettingController::class)->parameters(['seo-settings' => 'seo_setting']);
        Route::resource('sliders', \App\Http\Controllers\Admin\SliderController::class);
        Route::resource('team-members', \App\Http\Controllers\Admin\TeamController::class);
        Route::resource('inquiries', \App\Http\Controllers\Admin\ContactInquiryController::class)->except(['create', 'store', 'show']);
        Route::post('inquiries/{inquiry}/mark-as-read', [\App\Http\Controllers\Admin\ContactInquiryController::class, 'markAsRead'])->name('inquiries.mark-as-read');

        // ── Team members extras ───────────────────────────────────────────────────
        Route::post('team-members/reorder', [\App\Http\Controllers\Admin\TeamController::class, 'reorder'])->name('team-members.reorder');
        Route::post('team-members/{team_member}/toggle', [\App\Http\Controllers\Admin\TeamController::class, 'toggleActive'])->name('team-members.toggle');

        // ── Media extras ──────────────────────────────────────────────────────────
        Route::post('media/bulk-delete', [\App\Http\Controllers\Admin\MediaController::class, 'bulkDelete'])->name('media.bulk-delete');
        Route::patch('media/{medium}/rename', [\App\Http\Controllers\Admin\MediaController::class, 'rename'])->name('media.rename');

        // ── Slider extras ─────────────────────────────────────────────────────────
        Route::post('sliders/reorder', [\App\Http\Controllers\Admin\SliderController::class, 'reorder'])->name('sliders.reorder');
        Route::post('sliders/{slider}/toggle', [\App\Http\Controllers\Admin\SliderController::class, 'toggleActive'])->name('sliders.toggle');

        // ── Branding ──────────────────────────────────────────────────────────────
        Route::get('branding', [\App\Http\Controllers\Admin\ImageController::class, 'branding'])->name('branding.index');
        Route::post('branding', [\App\Http\Controllers\Admin\ImageController::class, 'updateBranding'])->name('branding.update');
        Route::delete('branding', [\App\Http\Controllers\Admin\ImageController::class, 'removeBranding'])->name('branding.remove');

        // ── Rich-text editor image upload ─────────────────────────────────────────
        Route::post('image/upload', [\App\Http\Controllers\Admin\ImageController::class, 'upload'])->name('image.upload');

        // ── Stub / in-development pages ───────────────────────────────────────────
        Route::get('/newsletter',    fn() => inertia('Admin/Newsletter/Index'))->name('newsletter.index');
        Route::get('/roles',         fn() => inertia('Admin/Roles/Index'))->name('roles.index');
        Route::get('/analytics',     fn() => inertia('Admin/Analytics/Index'))->name('analytics.index');
        Route::get('/activity-logs', fn() => inertia('Admin/ActivityLogs/Index'))->name('activity-logs.index');
        Route::get('/backup',        fn() => inertia('Admin/Backup/Index'))->name('backup.index');
        Route::get('/system-info',   fn() => inertia('Admin/SystemInfo/Index'))->name('system-info.index');
    });
});

require __DIR__.'/auth.php';
