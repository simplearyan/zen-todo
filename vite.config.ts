import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'ZenTodo - Premium Tasks & Boards',
        short_name: 'ZenTodo',
        description: 'Organize your life with ZenTodo. Minimalist lists and powerful task boards.',
        theme_color: '#3B82F6',
        background_color: '#141415',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'portrait-primary',
        categories: ['productivity', 'utilities'],
        icons: [
          {
            src: 'icons/icon-v1-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-v1-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/icon-v1-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
