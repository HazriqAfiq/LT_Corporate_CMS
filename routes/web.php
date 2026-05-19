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
Route::get('/sitemap.xml', [PublicController::class, 'sitemap'])->name('sitemap');

// Auth Routes (Breeze)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
