import {defineConfig} from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        // The React and Tailwind plugins are both required for Make, even if
        // Tailwind is not being actively used – do not remove them
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            // Alias @ to the src directory
            '@': path.resolve(__dirname, './src'),
        },
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) return
                    const normalizedId = id.replaceAll('\\', '/')
                    if (/\/node_modules\/(react|react-dom|react-router|scheduler)\//.test(normalizedId)) {
                        return 'vendor-react'
                    }
                    if (normalizedId.includes('@mui') || normalizedId.includes('@emotion')) {
                        return 'vendor-mui'
                    }
                    if (normalizedId.includes('framer-motion') || normalizedId.includes('/motion/')) {
                        return 'vendor-motion'
                    }
                    if (normalizedId.includes('recharts') || normalizedId.includes('/d3-')) {
                        return 'vendor-charts'
                    }
                    if (normalizedId.includes('@radix-ui') || normalizedId.includes('lucide-react')) {
                        return 'vendor-ui'
                    }
                    const modulePath = normalizedId.split('/node_modules/')[1]
                    if (!modulePath) return
                    const segments = modulePath.split('/')
                    const packageName = segments[0].startsWith('@')
                        ? `${segments[0]}-${segments[1]}`
                        : segments[0]
                    if (packageName === 'cookie' || packageName === 'set-cookie-parser') return
                    return `vendor-${packageName.replace('@', '')}`
                },
            },
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        css: true,
        setupFiles: './src/test/setupTests.ts',

        // In dev, proxy API + websocket to the backend container so browsers on the LAN
        // don't need a hard-coded IP/hostname for the API.
        server: {
            host: true,
            proxy: {
                '/api': {
                    target: 'http://backend:3000',
                    changeOrigin: true,
                    rewrite: (p) => p.replace(/^\/api/, ''),
                },
                '/socket.io': {
                    target: 'http://backend:3000',
                    ws: true,
                    changeOrigin: true,
                },
            },
        },
    },
})

