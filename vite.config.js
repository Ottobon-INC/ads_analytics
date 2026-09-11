import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8081,
    host: true,
    proxy: {
      '/api': 'http://127.0.0.1:3001'
    }
  },
  preview: {
    port: 8081,
    host: true
  }
})
