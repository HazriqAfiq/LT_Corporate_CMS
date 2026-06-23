import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    build: {
        // Instruct esbuild to target modern browsers — skips polyfills for
        // optional chaining, nullish coalescing, etc. already supported natively.
        target: 'es2020',
        // Increase warning threshold to avoid noise (default is 500kb)
        chunkSizeWarningLimit: 1000,
        // Ensure CSS is code-split per page chunk for optimal loading
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                // Split vendor libraries into separate long-cached chunks
                manualChunks(id) {
                    if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
                        return 'react-vendor';
                    }
                    if (id.includes('node_modules/lucide-react')) {
                        return 'lucide-vendor';
                    }
                    if (id.includes('node_modules/@inertiajs') || id.includes('node_modules/@headlessui')) {
                        return 'inertia-vendor';
                    }
                    if (id.includes('node_modules/recharts') || id.includes('node_modules/react-chartjs-2') || id.includes('node_modules/chart.js')) {
                        return 'charts-vendor';
                    }
                    if (id.includes('node_modules/quill')) {
                        return 'editor-vendor';
                    }
                    // Tree-shakeable lodash-es gets its own cacheable chunk
                    if (id.includes('node_modules/lodash-es')) {
                        return 'utils-vendor';
                    }
                    // @fontsource font CSS/WOFF2 assets are handled as static files by Vite
                },
            },
        },
    },
});

