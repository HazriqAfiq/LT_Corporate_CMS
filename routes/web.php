<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;

// Public Website Routes
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/tentang-kami', [PublicController::class, 'about'])->name('about');
Route::get('/perkhidmatan', [PublicController::class, 'services'])->name('services');
Route::get('/perkhidmatan/{slug}', [PublicController::class, 'serviceDetail'])->name('services.detail');
Route::get('/produk', [PublicController::class, 'products'])->name('products');
Route::get('/produk/{slug}', [PublicController::class, 'productDetail'])->name('products.detail');
Route::get('/portfolio', [PublicController::class, 'portfolio'])->name('portfolio');
Route::get('/portfolio/{slug}', [PublicController::class, 'portfolioDetail'])->name('portfolio.detail');
Route::get('/artikel', [PublicController::class, 'articles'])->name('articles');
Route::get('/artikel/{slug}', [PublicController::class, 'articleDetail'])->name('articles.detail');
Route::get('/hubungi-kami', [PublicController::class, 'contact'])->name('contact');
Route::post('/hubungi-kami', [PublicController::class, 'contactSubmit'])->name('contact.submit');
Route::post('/newsletter/subscribe', [PublicController::class, 'newsletterSubscribe'])->name('newsletter.subscribe');
Route::get('/dasar-privasi', [PublicController::class, 'privacy'])->name('privacy');
Route::get('/terma-syarat', [PublicController::class, 'terms'])->name('terms');

// Public Promo & Booking Routes
Route::get('/promosi', [\App\Http\Controllers\PromoController::class, 'index'])->name('promo.index');
Route::get('/promosi/tempah', [\App\Http\Controllers\PromoController::class, 'bookForm'])->name('promo.book.form');
Route::post('/promosi/tempah', [\App\Http\Controllers\PromoController::class, 'book'])->name('promo.book');
Route::get('/promosi/checkout/mock/{uuid}', [\App\Http\Controllers\PromoController::class, 'mockCheckout'])->name('promo.checkout.mock');
Route::post('/promosi/checkout/mock/{uuid}/pay', [\App\Http\Controllers\PromoController::class, 'mockPay'])->name('promo.checkout.mock.pay');
Route::post('/promosi/checkout/mock/{uuid}/cancel', [\App\Http\Controllers\PromoController::class, 'mockCancel'])->name('promo.checkout.mock.cancel');
Route::get('/promosi/success/{uuid?}', [\App\Http\Controllers\PromoController::class, 'success'])->name('promo.success');
Route::get('/promosi/cancel/{uuid?}', [\App\Http\Controllers\PromoController::class, 'cancel'])->name('promo.cancel');
Route::get('/promosi/checkout/retry/{uuid}', [\App\Http\Controllers\PromoController::class, 'retryPayment'])->name('promo.checkout.retry');
Route::post('/webhooks/stripe', [\App\Http\Controllers\PromoController::class, 'stripeWebhook'])->name('promo.webhook');

Route::get('/sitemap.xml', function () {
    $xml = '<?xml version="1.0" encoding="UTF-8"?>';
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    
    $baseUrl = str_contains(request()->getHost(), 'lamanteknologi.com.my') 
        ? 'https://lamanteknologi.com.my' 
        : request()->schemeAndHttpHost();

    $staticPages = [
        '',
        '/tentang-kami',
        '/perkhidmatan',
        '/produk',
        '/portfolio',
        '/artikel',
        '/hubungi-kami',
        '/dasar-privasi',
        '/terma-syarat'
    ];
    foreach ($staticPages as $page) {
        $xml .= '<url>';
        $xml .= '<loc>' . $baseUrl . $page . '</loc>';
        $xml .= '<changefreq>weekly</changefreq>';
        $xml .= '<priority>0.8</priority>';
        $xml .= '</url>';
    }

    foreach (\App\Models\Article::published()->get() as $article) {
        $xml .= '<url>';
        $xml .= '<loc>' . $baseUrl . '/artikel/' . $article->slug . '</loc>';
        $xml .= '<lastmod>' . $article->updated_at->toAtomString() . '</lastmod>';
        $xml .= '<changefreq>weekly</changefreq>';
        $xml .= '<priority>0.7</priority>';
        $xml .= '</url>';
    }

    foreach (\App\Models\Service::active()->get() as $service) {
        $xml .= '<url>';
        $xml .= '<loc>' . $baseUrl . '/perkhidmatan/' . $service->slug . '</loc>';
        $xml .= '<changefreq>monthly</changefreq>';
        $xml .= '<priority>0.7</priority>';
        $xml .= '</url>';
    }

    foreach (\App\Models\Product::active()->get() as $product) {
        $xml .= '<url>';
        $xml .= '<loc>' . $baseUrl . '/produk/' . $product->slug . '</loc>';
        $xml .= '<changefreq>monthly</changefreq>';
        $xml .= '<priority>0.7</priority>';
        $xml .= '</url>';
    }

    foreach (\App\Models\Project::published()->get() as $project) {
        $xml .= '<url>';
        $xml .= '<loc>' . $baseUrl . '/portfolio/' . $project->slug . '</loc>';
        $xml .= '<changefreq>monthly</changefreq>';
        $xml .= '<priority>0.7</priority>';
        $xml .= '</url>';
    }

    $xml .= '</urlset>';

    return response($xml, 200, ['Content-Type' => 'application/xml']);
});
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
            ->middleware('permission:access_dashboard')
            ->name('dashboard');

        // ── Articles ─────────────────────────────────────────────────────────────
        Route::resource('articles', \App\Http\Controllers\Admin\ArticleController::class);

        // ── Projects ─────────────────────────────────────────────────────────────
        Route::resource('projects', \App\Http\Controllers\Admin\ProjectController::class);

        // ── Users ─────────────────────────────────────────────────────────────────
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class);

        // ── Settings ─────────────────────────────────────────────────────────────
        Route::post('settings/bulk-update', [\App\Http\Controllers\Admin\SettingController::class, 'bulkUpdate'])
            ->middleware('permission:edit_settings')
            ->name('settings.bulk-update');
        Route::resource('settings', \App\Http\Controllers\Admin\SettingController::class);

        // ── Promo Orders ─────────────────────────────────────────────────────────
        Route::get('promo-orders', [\App\Http\Controllers\Admin\PromoOrderController::class, 'index'])->name('promo-orders.index');
        Route::post('promo-orders/{id}/mark-paid', [\App\Http\Controllers\Admin\PromoOrderController::class, 'markPaid'])->name('promo-orders.mark-paid');
        Route::delete('promo-orders/{id}', [\App\Http\Controllers\Admin\PromoOrderController::class, 'destroy'])->name('promo-orders.destroy');


        // ── Media ─────────────────────────────────────────────────────────────────
        Route::resource('media', \App\Http\Controllers\Admin\MediaController::class);
        Route::post('media/bulk-delete', [\App\Http\Controllers\Admin\MediaController::class, 'bulkDelete'])
            ->middleware('permission:manage_media')
            ->name('media.bulk-delete');
        Route::patch('media/{medium}/rename', [\App\Http\Controllers\Admin\MediaController::class, 'rename'])
            ->name('media.rename');

        // ── Products ─────────────────────────────────────────────────────────────
        Route::resource('products', \App\Http\Controllers\Admin\ProductController::class);

        // ── Services ─────────────────────────────────────────────────────────────
        Route::resource('services', \App\Http\Controllers\Admin\ServiceController::class);

        // ── SEO Settings ─────────────────────────────────────────────────────────
        Route::resource('seo-settings', \App\Http\Controllers\Admin\SeoSettingController::class)
            ->parameters(['seo-settings' => 'seo_setting']);

        // ── Sliders ──────────────────────────────────────────────────────────────
        Route::resource('sliders', \App\Http\Controllers\Admin\SliderController::class);
        Route::post('sliders/reorder', [\App\Http\Controllers\Admin\SliderController::class, 'reorder'])
            ->middleware('permission:edit_sliders')
            ->name('sliders.reorder');
        Route::post('sliders/{slider}/toggle', [\App\Http\Controllers\Admin\SliderController::class, 'toggleActive'])
            ->middleware('permission:edit_sliders')
            ->name('sliders.toggle');

        // ── Team Members ─────────────────────────────────────────────────────────
        Route::resource('team-members', \App\Http\Controllers\Admin\TeamController::class);
        Route::post('team-members/reorder', [\App\Http\Controllers\Admin\TeamController::class, 'reorder'])
            ->middleware('permission:edit_sliders')
            ->name('team-members.reorder');
        Route::post('team-members/{team_member}/toggle', [\App\Http\Controllers\Admin\TeamController::class, 'toggleActive'])
            ->middleware('permission:edit_sliders')
            ->name('team-members.toggle');

        // ── Inquiries ─────────────────────────────────────────────────────────────
        Route::resource('inquiries', \App\Http\Controllers\Admin\ContactInquiryController::class)
            ->except(['create', 'store', 'show']);
        Route::post('inquiries/{inquiry}/mark-as-read', [\App\Http\Controllers\Admin\ContactInquiryController::class, 'markAsRead'])
            ->middleware('permission:edit_inquiries')
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
            ->middleware('permission:manage_media')
            ->name('image.upload');

        // ── Stub / in-development pages ───────────────────────────────────────
        Route::get('/analytics', [\App\Http\Controllers\Admin\AnalyticsController::class, 'index'])
            ->name('analytics.index');

        // ── Newsletter ────────────────────────────────────────────────────────
        Route::get('newsletter', [\App\Http\Controllers\Admin\NewsletterController::class, 'index'])->name('newsletter.index');
        Route::delete('newsletter/{newsletter}', [\App\Http\Controllers\Admin\NewsletterController::class, 'destroy'])->name('newsletter.destroy');
        Route::post('newsletter/{newsletter}/toggle', [\App\Http\Controllers\Admin\NewsletterController::class, 'toggleStatus'])->name('newsletter.toggle');
        Route::get('newsletter/export', [\App\Http\Controllers\Admin\NewsletterController::class, 'export'])->name('newsletter.export');
        Route::post('newsletter/send', [\App\Http\Controllers\Admin\NewsletterController::class, 'sendCampaign'])->name('newsletter.send');
        Route::get('newsletter/history/{campaign}', [\App\Http\Controllers\Admin\NewsletterController::class, 'show'])->name('newsletter.history.show');

        // ── Backup ────────────────────────────────────────────────────────────
        Route::get('backup', [\App\Http\Controllers\Admin\BackupController::class, 'index'])->name('backup.index');
        Route::post('backup/run', [\App\Http\Controllers\Admin\BackupController::class, 'run'])->name('backup.run');
        Route::get('backup/download/{filename}', [\App\Http\Controllers\Admin\BackupController::class, 'download'])->name('backup.download')->where('filename', '.+');
        Route::delete('backup/{filename}', [\App\Http\Controllers\Admin\BackupController::class, 'delete'])->name('backup.delete')->where('filename', '.+');

        // ── System Info ───────────────────────────────────────────────────────
        Route::get('/system-info', [\App\Http\Controllers\Admin\SystemInfoController::class, 'index'])->name('system-info.index');

        // ── Activity Logs ─────────────────────────────────────────────────────────
        Route::get('/activity-logs', [\App\Http\Controllers\Admin\ActivityLogController::class, 'index'])
            ->name('activity-logs.index');
        Route::delete('/activity-logs/clear', [\App\Http\Controllers\Admin\ActivityLogController::class, 'clear'])
            ->name('activity-logs.clear');

        // ── System Routes (Super Admin Only) ─────────────────────────────────────
        Route::middleware('role:Super Admin')->group(function () {
            // ── Roles & Permissions ───────────────────────────────────────────────────
            Route::resource('roles', \App\Http\Controllers\Admin\RoleController::class);
        });
    });
});

require __DIR__.'/auth.php';
