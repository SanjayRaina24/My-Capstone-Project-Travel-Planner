import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: true, // Needed for Dev Container
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Points to Backend inside the container
        changeOrigin: true,
        secure: false,
      }
    }
  }
})