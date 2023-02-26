import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({ reactivityTransform: true })],
  base: './',

  build: {
    emptyOutDir: false,
    minify: false,

    rollupOptions: {
      input: {
        app: resolve(__dirname, '../src/popup/index.html'),
      },

      output: {
        manualChunks: {}
      },
    },
  }
})
