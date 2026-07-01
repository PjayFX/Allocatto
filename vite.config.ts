import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['Allocatto.png'],
      manifest: {
        id: '/',
        name: 'Allocatto',
        short_name: 'Allocatto',
        description: 'Plan your salary; track your daily allowance.',
        lang: 'en',
        dir: 'ltr',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        categories: ['finance', 'productivity'],
        icons: [{ src: 'Allocatto.png', sizes: '1024x1024', type: 'image/png', purpose: 'any maskable' }],
        // Reuse the running window (and fire the launchQueue) when opened via a file.
        launch_handler: { client_mode: 'focus-existing' },
        // Installed app opens its own backup files, launching straight into import.
        file_handlers: [{ action: '/', accept: { 'application/json': ['.allocatto'] } }],
      },
      devOptions: { enabled: true },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
