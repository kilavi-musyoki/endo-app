import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'images/pain-map-front.png', 'images/pain-map-back.png'],
      manifest: {
        name: 'EndoCare Companion',
        short_name: 'EndoCare',
        description: 'Confidential symptom tracking and clinician visit preparation.',
        theme_color: '#ba425a',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        navigateFallback: '/index.html'
      }
    })
  ],
  server: {
    port: 3000,
    open: true
  }
})
