import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectRegister: false,
      injectManifest: { globPatterns: ['**/*.{js,css,html,svg,png,woff2}'] },
      devOptions: { enabled: false, type: 'module' },
      manifest: {
        name: 'Marketing OS',
        short_name: 'Marketing OS',
        description: 'Daily marketing work OS — Overdue, Aaj, Next. Kaam kabhi nahi rukega.',
        theme_color: '#070b19',
        background_color: '#070b19',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ],
        shortcuts: [
          { name: 'Quick add', url: '/?add=1', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] }
        ]
      }
    })
  ],
  test: { environment: 'node' }
} as any);
