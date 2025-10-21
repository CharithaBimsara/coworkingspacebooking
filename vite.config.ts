import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
 server: {
  allowedHosts: true
},
  

  
  // server: {
  //   host: '192.168.8.125',  // listen on all network interfaces
  //   port: 5173        // keep or change if you like
  // },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  
  build: {
    // Increase the warning limit for chunk sizes
    chunkSizeWarningLimit: 550,
    
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'vue',
            'vue-router',
            'pinia'
          ],
          'pdf-utils': [
            'jspdf', 
            'html2canvas'
            // 'qrcode'
          ],
          'ui-components': [
            './src/components/AppHeader.vue',
            './src/components/ThemeToggle.vue'
          ]
        }
      }
    },
    
    // Optimize CSS output
    cssCodeSplit: true,
    
    // Enable source maps for production (remove in final production build if not needed)
    sourcemap: process.env.NODE_ENV !== 'production',
  }
})
