import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { lazy, Suspense } from 'react';

// Track page views in Google Analytics on Inertia navigation (SPA transitions)
router.on('navigate', (event) => {
    const url = event.detail.page.url;
    // Exclude admin pages from Google Analytics
    if (url.startsWith('/admin') || url.startsWith('admin')) {
        return;
    }
    if (typeof window.gtag === 'function') {
        window.gtag('config', 'G-BCC6Q08RWQ', {
            page_path: url,
            page_title: document.title,
        });
    }
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Minimal fallback shown during route-level code chunk loading
function PageLoader() {
    return (
        <div style={{
            position: 'fixed', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#080808', zIndex: 9999,
        }}>
            <div style={{
                width: 32, height: 32, border: '3px solid #27272a',
                borderTopColor: '#eab308', borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            // Use lazy glob — Vite splits each page into its own chunk automatically
            import.meta.glob('./Pages/**/*.jsx', { eager: false }),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <Suspense fallback={<PageLoader />}>
                <App {...props} />
            </Suspense>
        );
    },
    progress: {
        // Brand gold progress bar for page navigation
        color: '#eab308',
    },
});
