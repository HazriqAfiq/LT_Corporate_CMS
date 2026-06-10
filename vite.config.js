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
        // Increase warning threshold to avoid noise (default is 500kb)
        chunkSizeWarningLimit: 1000,
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
                    if (id.includes('node_modules/recharts') || id.includes('node_modules/chart.js') || id.includes('node_modules/react-chartjs')) {
                        return 'charts-vendor';
                    }
                    if (id.includes('node_modules/quill') || id.includes('node_modules/react-quill')) {
                        return 'editor-vendor';
                    }
                },
            },
        },
    },
});
