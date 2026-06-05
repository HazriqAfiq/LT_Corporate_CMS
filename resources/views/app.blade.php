<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-BCC6Q08RWQ"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-BCC6Q08RWQ');
        </script>

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        @php
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
        @endphp
        <link rel="icon" type="{{ $type }}" href="{{ $faviconUrl }}" />

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
