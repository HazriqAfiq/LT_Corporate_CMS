<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
    <head>
        <?php if(!request()->is('admin*') && !request()->is('admin')): ?>
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-BCC6Q08RWQ"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-BCC6Q08RWQ');
        </script>
        <?php endif; ?>

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">

        <!-- Mobile browser chrome color (matches dark theme) -->
        <meta name="theme-color" content="#080808">
        <meta name="color-scheme" content="dark">

        <?php
            $faviconUrl = '/storage/uploads/branding/favicon.png';
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
            }
        ?>
        <link rel="icon" type="<?php echo e($type); ?>" href="<?php echo e($faviconUrl); ?>" />

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
    </head>
    <body class="font-sans antialiased">
        <?php if (!isset($__inertiaSsrDispatched)) { $__inertiaSsrDispatched = true; $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page); }  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->body; } elseif (config('inertia.use_script_element_for_initial_page')) { ?><script data-page="app" type="application/json"><?php echo json_encode($page); ?></script><div id="app"></div><?php } else { ?><div id="app" data-page="<?php echo e(json_encode($page)); ?>"></div><?php } ?>
    </body>
</html>
<?php /**PATH C:\Users\USER\Documents\Project Code\laman_teknologi_corporate_cms\resources\views/app.blade.php ENDPATH**/ ?>