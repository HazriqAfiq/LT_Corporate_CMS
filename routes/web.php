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


// Auth Routes (Breeze) & Admin
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', function () {
        return redirect()->route('admin.dashboard');
    })->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        // ── Dashboard ─────────────────────────────────────────────────────────────
        Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])
            ->middleware('permission:view_dashboard')
            ->name('dashboard');

        // ── Articles ─────────────────────────────────────────────────────────────
        Route::resource('articles', \App\Http\Controllers\Admin\ArticleController::class)
            ->middleware('permission:view_articles');

        // ── Projects ─────────────────────────────────────────────────────────────
        Route::resource('projects', \App\Http\Controllers\Admin\ProjectController::class)
            ->middleware('permission:view_projects');

        // ── Users ─────────────────────────────────────────────────────────────────
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class)
            ->middleware('permission:view_users');

        // ── Settings ─────────────────────────────────────────────────────────────
        Route::post('settings/bulk-update', [\App\Http\Controllers\Admin\SettingController::class, 'bulkUpdate'])
            ->middleware('permission:edit_settings')
            ->name('settings.bulk-update');
        Route::resource('settings', \App\Http\Controllers\Admin\SettingController::class)
            ->middleware('permission:view_settings');

        // ── Media ─────────────────────────────────────────────────────────────────
        Route::resource('media', \App\Http\Controllers\Admin\MediaController::class)
            ->middleware('permission:view_media');
        Route::post('media/bulk-delete', [\App\Http\Controllers\Admin\MediaController::class, 'bulkDelete'])
            ->middleware('permission:delete_media')
            ->name('media.bulk-delete');
        Route::patch('media/{medium}/rename', [\App\Http\Controllers\Admin\MediaController::class, 'rename'])
            ->middleware('permission:upload_media')
            ->name('media.rename');

        // ── Products ─────────────────────────────────────────────────────────────
        Route::resource('products', \App\Http\Controllers\Admin\ProductController::class)
            ->middleware('permission:view_products');

        // ── SEO Settings ─────────────────────────────────────────────────────────
        Route::resource('seo-settings', \App\Http\Controllers\Admin\SeoSettingController::class)
            ->parameters(['seo-settings' => 'seo_setting'])
            ->middleware('permission:view_settings');

        // ── Sliders ──────────────────────────────────────────────────────────────
        Route::resource('sliders', \App\Http\Controllers\Admin\SliderController::class)
            ->middleware('permission:view_sliders');
        Route::post('sliders/reorder', [\App\Http\Controllers\Admin\SliderController::class, 'reorder'])
            ->middleware('permission:edit_sliders')
            ->name('sliders.reorder');
        Route::post('sliders/{slider}/toggle', [\App\Http\Controllers\Admin\SliderController::class, 'toggleActive'])
            ->middleware('permission:edit_sliders')
            ->name('sliders.toggle');

        // ── Team Members ─────────────────────────────────────────────────────────
        Route::resource('team-members', \App\Http\Controllers\Admin\TeamController::class)
            ->middleware('permission:view_sliders');
        Route::post('team-members/reorder', [\App\Http\Controllers\Admin\TeamController::class, 'reorder'])
            ->middleware('permission:edit_sliders')
            ->name('team-members.reorder');
        Route::post('team-members/{team_member}/toggle', [\App\Http\Controllers\Admin\TeamController::class, 'toggleActive'])
            ->middleware('permission:edit_sliders')
            ->name('team-members.toggle');

        // ── Inquiries ─────────────────────────────────────────────────────────────
        Route::resource('inquiries', \App\Http\Controllers\Admin\ContactInquiryController::class)
            ->except(['create', 'store', 'show'])
            ->middleware('permission:view_inquiries');
        Route::post('inquiries/{inquiry}/mark-as-read', [\App\Http\Controllers\Admin\ContactInquiryController::class, 'markAsRead'])
            ->middleware('permission:manage_inquiries')
            ->name('inquiries.mark-as-read');

        // ── Branding ──────────────────────────────────────────────────────────────
        Route::get('branding', [\App\Http\Controllers\Admin\ImageController::class, 'branding'])
            ->middleware('permission:edit_settings')
            ->name('branding.index');
        Route::post('branding/media', [\App\Http\Controllers\Admin\ImageController::class, 'updateBrandingMedia'])
            ->middleware('permission:edit_settings')
            ->name('branding.update-media');

        // ── Rich-text editor image upload ─────────────────────────────────────────
        Route::post('image/upload', [\App\Http\Controllers\Admin\ImageController::class, 'upload'])
            ->middleware('permission:upload_media')
            ->name('image.upload');

        // ── Roles & Permissions ───────────────────────────────────────────────────
        Route::resource('roles', \App\Http\Controllers\Admin\RoleController::class);

        // ── Stub / in-development pages ───────────────────────────────────────────
        Route::get('/newsletter',  fn() => inertia('Admin/Newsletter/Index'))->name('newsletter.index');
        Route::get('/analytics',   fn() => inertia('Admin/Analytics/Index'))->name('analytics.index');
        Route::get('/backup',      fn() => inertia('Admin/Backup/Index'))->name('backup.index');
        Route::get('/system-info', fn() => inertia('Admin/SystemInfo/Index'))->name('system-info.index');

        // ── Activity Logs ─────────────────────────────────────────────────────────
        Route::get('/activity-logs', [\App\Http\Controllers\Admin\ActivityLogController::class, 'index'])
            ->name('activity-logs.index');
        Route::delete('/activity-logs/clear', [\App\Http\Controllers\Admin\ActivityLogController::class, 'clear'])
            ->name('activity-logs.clear');
    });
});

require __DIR__.'/auth.php';
