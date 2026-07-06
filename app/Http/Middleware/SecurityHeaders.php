<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Standard security headers
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');

        // Remove PHP version exposure
        if (function_exists('header_remove')) {
            header_remove('X-Powered-By');
        }
        $response->headers->remove('X-Powered-By');

        // Apply strict transport security and content security policy
        if (app()->environment('production')) {
            // Strict Transport Security (HSTS)
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

            // Content Security Policy (CSP) for Production
            $csp = "default-src 'self'; " .
                   "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.googletagmanager.com https://*.google-analytics.com; " .
                   "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " .
                   "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com https://*.googletagmanager.com https://*.google-analytics.com https://*.g.doubleclick.net /storage/ http: https:; " .
                   "font-src 'self' https://fonts.gstatic.com data:; " .
                   "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.g.doubleclick.net https://*.googletagmanager.com; " .
                   "frame-src 'self' https://www.google.com https://maps.google.com https://www.openstreetmap.org; " .
                   "object-src 'none'; " .
                   "base-uri 'self'; " .
                   "form-action 'self';";
            $response->headers->set('Content-Security-Policy', $csp);
        } else {
            // In local/development environments, use a relaxed CSP to avoid breaking hot-reloading (Vite)
            $csp = "default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* ws://localhost:* http://127.0.0.1:* ws://127.0.0.1:* http://[::1]:* ws://[::1]:*; " .
                   "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* http://127.0.0.1:* http://[::1]:* https://www.googletagmanager.com https://www.google-analytics.com https://*.googletagmanager.com https://*.google-analytics.com; " .
                   "style-src 'self' 'unsafe-inline' http://localhost:* http://127.0.0.1:* http://[::1]:* https://fonts.googleapis.com; " .
                   "img-src 'self' data: http://localhost:* http://127.0.0.1:* http://[::1]:* https://www.googletagmanager.com https://www.google-analytics.com https://*.googletagmanager.com https://*.google-analytics.com https://*.g.doubleclick.net /storage/ http: https:; " .
                   "font-src 'self' http://localhost:* http://127.0.0.1:* http://[::1]:* https://fonts.gstatic.com data:; " .
                   "connect-src 'self' http://localhost:* ws://localhost:* http://127.0.0.1:* ws://127.0.0.1:* http://[::1]:* ws://[::1]:* https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.g.doubleclick.net https://*.googletagmanager.com; " .
                   "frame-src 'self' https://www.google.com https://maps.google.com https://www.openstreetmap.org; " .
                   "object-src 'none'; " .
                   "base-uri 'self'; " .
                   "form-action 'self';";
            $response->headers->set('Content-Security-Policy', $csp);
        }

        return $response;
    }
}
