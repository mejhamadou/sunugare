import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    https: true,
    port: 3020,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8082', // ⚠️ Ton port backend
        changeOrigin: true,
      },
    },
  },
})