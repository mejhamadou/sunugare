import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    port: 3020,
    proxy: {
      '/api': {
        target: 'http://localhost:8082', // ⚠️ Ton port backend
        changeOrigin: true,
      },
    },
  },
})