import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion'))  return 'vendor-motion';
            if (id.includes('lucide-react') || id.includes('react-icons')) return 'vendor-icons';
            if (id.includes('sweetalert2'))    return 'vendor-utils';
            if (id.includes('axios'))          return 'vendor-utils';
            if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/')) return 'vendor-react';
          }
        },
      },
    },
    // Advertir si algún chunk supera 500KB
    chunkSizeWarningLimit: 500,
  },
})