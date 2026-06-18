<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        @if (!request()->is('admin*') && !request()->is('admin'))
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-BCC6Q08RWQ"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-BCC6Q08RWQ');
        </script>
        @endif

        <meta charset="utf-8">
        <meta name="google-site-verification" content="pKHnFf8J2itTw3UrruvVpQ9jCBXaOKe7cdmpn5_dtXw" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Mobile browser chrome color (matches dark theme) -->
        <meta name="theme-color" content="#080808">
        <meta name="color-scheme" content="dark">

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
        <link rel="shortcut icon" href="{{ $faviconUrl }}" type="{{ $type }}" />
        <link rel="icon" type="{{ $type }}" href="{{ $faviconUrl }}" />
        <link rel="apple-touch-icon" href="{{ $faviconUrl }}" />

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- DNS prefetch for external resources -->
        <link rel="dns-prefetch" href="https://fonts.googleapis.com">
        <link rel="dns-prefetch" href="https://fonts.gstatic.com">

        <!-- Fonts — display=swap prevents render-blocking FOIT -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet" />

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
