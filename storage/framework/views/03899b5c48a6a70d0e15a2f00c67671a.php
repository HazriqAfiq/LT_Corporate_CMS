<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
    <head>
        <?php if(!request()->is('admin*') && !request()->is('admin')): ?>
        
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BCC6Q08RWQ');

            // Inject the GA script tag only after the page has fully loaded
            // and a short idle period, so it doesn't block FCP or LCP.
            function loadGA() {
                if (window._gaLoaded) return;
                window._gaLoaded = true;
                var s = document.createElement('script');
                s.src = 'https://www.googletagmanager.com/gtag/js?id=G-BCC6Q08RWQ';
                s.async = true;
                document.head.appendChild(s);
            }
            if (document.readyState === 'complete') {
                setTimeout(loadGA, 2000);
            } else {
                window.addEventListener('load', function() { setTimeout(loadGA, 2000); }, { once: true });
            }
        </script>
        <?php endif; ?>

        <meta charset="utf-8">
        <meta name="google-site-verification" content="pKHnFf8J2itTw3UrruvVpQ9jCBXaOKe7cdmpn5_dtXw" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">

        <!-- Canonical URL -->
        <?php
            $canonicalUrl = str_contains(request()->getHost(), 'lamanteknologi.com.my')
                ? 'https://lamanteknologi.com.my' . (request()->getPathInfo() === '/' ? '' : request()->getPathInfo())
                : request()->url();
        ?>
        <link rel="canonical" href="<?php echo e($canonicalUrl); ?>" />

        <?php
            $seoTitle = 'Laman Teknologi - Teknologi Untuk Organisasi';
            $seoDesc = 'Penyedia penyelesaian teknologi terbaik untuk organisasi anda.';
            $seoImageUrl = '';

            // 1. Fetch site defaults from database first
            if (\Illuminate\Support\Facades\Schema::hasTable('settings')) {
                // Title
                $titleSetting = \App\Models\Setting::where('key', 'seo_title')->first();
                if ($titleSetting && $titleSetting->value) {
                    $seoTitle = $titleSetting->value;
                }

                // Description
                $descSetting = \App\Models\Setting::where('key', 'seo_description')->first();
                if ($descSetting && $descSetting->value) {
                    $seoDesc = $descSetting->value;
                }

                // Image
                $imgSetting = \App\Models\Setting::where('key', 'seo_image')->first();
                if (!$imgSetting || !$imgSetting->value) {
                    $imgSetting = \App\Models\Setting::where('key', 'homepage_background')->first();
                }
                if ($imgSetting && $imgSetting->value) {
                    if (is_numeric($imgSetting->value)) {
                        $media = \App\Models\Media::find($imgSetting->value);
                        if ($media) {
                            $seoImageUrl = $media->url;
                        }
                    } else {
                        $val = $imgSetting->value;
                        $seoImageUrl = (str_starts_with($val, 'http') || str_starts_with($val, '/storage') || str_starts_with($val, 'storage'))
                            ? (str_starts_with($val, '/storage') || str_starts_with($val, 'http') ? $val : '/storage/' . $val)
                            : asset('storage/' . $val);
                    }
                }
            }

            // 2. Check if visiting a specific resource page and override defaults
            $props = isset($page['props']) ? $page['props'] : [];
            $resource = null;

            if (isset($props['article'])) {
                $resource = is_array($props['article']) ? (object) $props['article'] : $props['article'];
            } elseif (isset($props['product'])) {
                $resource = is_array($props['product']) ? (object) $props['product'] : $props['product'];
            } elseif (isset($props['service'])) {
                $resource = is_array($props['service']) ? (object) $props['service'] : $props['service'];
            } elseif (isset($props['project'])) {
                $resource = is_array($props['project']) ? (object) $props['project'] : $props['project'];
            }

            if ($resource) {
                // Title override: use meta_title first, fallback to title/name
                $resTitle = $resource->meta_title ?? $resource->title ?? $resource->name ?? null;
                if ($resTitle) {
                    $seoTitle = $resTitle . ' | ' . ($titleSetting->value ?? 'Laman Teknologi');
                }

                // Description override: use meta_description first, fallback to excerpt/description
                $resDesc = $resource->meta_description ?? $resource->excerpt ?? $resource->description ?? null;
                if ($resDesc) {
                    $seoDesc = strip_tags($resDesc);
                }

                // Image override: check if the resource has a featured media or gallery
                $mediaUrl = null;
                if (isset($resource->featured_media) && (is_object($resource->featured_media) || is_array($resource->featured_media))) {
                    $fm = (object) $resource->featured_media;
                    if (isset($fm->path)) {
                        $mediaUrl = '/storage/' . $fm->path;
                    }
                } 
                
                if (!$mediaUrl && isset($resource->featured_media_id) && $resource->featured_media_id) {
                    $media = \App\Models\Media::find($resource->featured_media_id);
                    if ($media) {
                        $mediaUrl = $media->url;
                    }
                }

                if (!$mediaUrl && isset($resource->gallery_media_ids) && is_array($resource->gallery_media_ids) && count($resource->gallery_media_ids) > 0) {
                    $firstMediaId = $resource->gallery_media_ids[0];
                    $media = \App\Models\Media::find($firstMediaId);
                    if ($media) {
                        $mediaUrl = $media->url;
                    }
                }

                if (!$mediaUrl && isset($props['galleryMedia']) && is_array($props['galleryMedia']) && count($props['galleryMedia']) > 0) {
                    $firstGallery = is_array($props['galleryMedia'][0]) ? (object) $props['galleryMedia'][0] : $props['galleryMedia'][0];
                    if (isset($firstGallery->url)) {
                        $mediaUrl = $firstGallery->url;
                    } elseif (isset($firstGallery->path)) {
                        $mediaUrl = '/storage/' . $firstGallery->path;
                    }
                }

                if (!$mediaUrl && isset($resource->featured_image) && $resource->featured_image) {
                    $val = $resource->featured_image;
                    $mediaUrl = (str_starts_with($val, 'http') || str_starts_with($val, '/storage') || str_starts_with($val, 'storage'))
                        ? (str_starts_with($val, '/storage') || str_starts_with($val, 'http') ? $val : '/storage/' . $val)
                        : '/storage/' . $val;
                }
                
                if ($mediaUrl) {
                    $seoImageUrl = $mediaUrl;
                }
            }

            // Ensure absolute URL for social crawlers
            if ($seoImageUrl && !str_starts_with($seoImageUrl, 'http')) {
                $seoImageUrl = url($seoImageUrl);
            }
        ?>

        <!-- SEO Meta Tags for Non-JS Crawlers (WhatsApp, Facebook, Telegram, etc.) -->
        <meta name="description" content="<?php echo e($seoDesc); ?>">
        <meta property="og:type" content="website">
        <meta property="og:title" content="<?php echo e($seoTitle); ?>">
        <meta property="og:description" content="<?php echo e($seoDesc); ?>">
        <?php if($seoImageUrl): ?>
        <meta property="og:image" content="<?php echo e($seoImageUrl); ?>">
        <?php endif; ?>
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="<?php echo e($seoTitle); ?>">
        <meta name="twitter:description" content="<?php echo e($seoDesc); ?>">
        <?php if($seoImageUrl): ?>
        <meta name="twitter:image" content="<?php echo e($seoImageUrl); ?>">
        <?php endif; ?>

        <!-- Mobile browser chrome color (matches dark theme) -->
        <meta name="theme-color" content="#080808">
        <meta name="color-scheme" content="dark">

        <?php
            $faviconUrl = '/storage/uploads/branding/favicon.webp';
            if (\Illuminate\Support\Facades\Schema::hasTable('settings')) {
                $setting = \App\Models\Setting::where('key', 'favicon')->first();
                if ($setting && $setting->value) {
                    if (is_numeric($setting->value)) {
                        $media = \App\Models\Media::find($setting->value);
                        if ($media) {
                            $faviconUrl = $media->url;
                        }
                    } else {
                        $val = $setting->value;
                        $faviconUrl = (str_starts_with($val, 'http') || str_starts_with($val, '/storage') || str_starts_with($val, 'storage'))
                            ? (str_starts_with($val, '/storage') || str_starts_with($val, 'http') ? $val : '/storage/' . $val)
                            : asset('storage/' . $val);
                    }
                }
            }
            $ext = pathinfo($faviconUrl, PATHINFO_EXTENSION);
            $type = 'image/x-icon';
            if ($ext === 'png') {
                $type = 'image/png';
            } elseif ($ext === 'svg') {
                $type = 'image/svg+xml';
            } elseif ($ext === 'webp') {
                $type = 'image/webp';
            }
        ?>
        <link rel="shortcut icon" href="<?php echo e($faviconUrl); ?>" type="<?php echo e($type); ?>" />
        <link rel="icon" type="<?php echo e($type); ?>" href="<?php echo e($faviconUrl); ?>" />
        <link rel="apple-touch-icon" href="<?php echo e($faviconUrl); ?>" />

        <?php if(!request()->is('admin*') && !request()->is('admin')): ?>
        <?php
            /* Preload the hero background image for public pages so the browser
               discovers and fetches it immediately from the HTML response,
               before React hydrates and renders the <img> tag. */
            $heroBg = '/storage/uploads/homepage_bg.webp';
            if (\Illuminate\Support\Facades\Schema::hasTable('settings')) {
                $heroBgSetting = \App\Models\Setting::where('key', 'homepage_background')->first();
                if ($heroBgSetting && $heroBgSetting->value) {
                    $heroBg = $heroBgSetting->value;
                    if (!str_starts_with($heroBg, 'http') && !str_starts_with($heroBg, '/')) {
                        $heroBg = '/storage/' . $heroBg;
                    }
                }
            }
        ?>
        <link rel="preload" as="image" href="<?php echo e($heroBg); ?>" fetchpriority="high">
        <?php endif; ?>

        <title inertia><?php echo e(config('app.name', 'Laravel')); ?></title>

        <!-- DNS prefetch for external resources -->
        <link rel="dns-prefetch" href="https://fonts.googleapis.com">
        <link rel="dns-prefetch" href="https://fonts.gstatic.com">

        <!-- Fonts — display=swap prevents render-blocking FOIT -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        <?php echo app('Tighten\Ziggy\BladeRouteGenerator')->generate(); ?>
        <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
        <?php echo app('Illuminate\Foundation\Vite')(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"]); ?>
        <?php if (!isset($__inertiaSsrDispatched)) { $__inertiaSsrDispatched = true; $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page); }  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->head; } ?>
        <?php
            $jsonLd = [
                '@context' => 'https://schema.org',
                '@graph' => [
                    [
                        '@type' => 'WebSite',
                        '@id' => $canonicalUrl . '/#website',
                        'url' => $canonicalUrl,
                        'name' => $seoTitle,
                        'description' => $seoDesc,
                    ],
                    [
                        '@type' => 'SiteNavigationElement',
                        '@id' => $canonicalUrl . '/#navigation',
                        'name' => [
                            app()->getLocale() === 'en' ? 'Home' : 'Laman Utama',
                            app()->getLocale() === 'en' ? 'About Us' : 'Tentang Kami',
                            app()->getLocale() === 'en' ? 'Services' : 'Perkhidmatan',
                            app()->getLocale() === 'en' ? 'Products' : 'Produk',
                            app()->getLocale() === 'en' ? 'Portfolio' : 'Portfolio',
                            app()->getLocale() === 'en' ? 'Articles' : 'Artikel',
                            app()->getLocale() === 'en' ? 'Contact Us' : 'Hubungi Kami',
                        ],
                        'url' => [
                            url('/'),
                            url('/tentang-kami'),
                            url('/perkhidmatan'),
                            url('/produk'),
                            url('/portfolio'),
                            url('/artikel'),
                            url('/hubungi-kami'),
                        ],
                    ],
                ],
            ];
        ?>
        <script type="application/ld+json">
        <?php echo json_encode($jsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); ?>

        </script>
    </head>
    <body class="font-sans antialiased">
        <?php if (!isset($__inertiaSsrDispatched)) { $__inertiaSsrDispatched = true; $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page); }  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->body; } elseif (config('inertia.use_script_element_for_initial_page')) { ?><script data-page="app" type="application/json"><?php echo json_encode($page); ?></script><div id="app"></div><?php } else { ?><div id="app" data-page="<?php echo e(json_encode($page)); ?>"></div><?php } ?>
    </body>
</html>

<?php /**PATH C:\Users\USER\Documents\Project Code\laman_teknologi_corporate_cms\resources\views/app.blade.php ENDPATH**/ ?>