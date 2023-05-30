import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Setup a proxy so we can send requests during development
      '/api/v1': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      
    },
  },

})
